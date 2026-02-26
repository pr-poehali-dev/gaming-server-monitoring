"""
Админ-панель: статистика, управление серверами и пользователями.
"""
import json
import os
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p84705017_gaming_server_monito')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin2077')

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def check_admin(conn, token: str) -> bool:
    if not token:
        return False
    cur = conn.cursor()
    cur.execute(f"SELECT role FROM {SCHEMA}.users WHERE session_token = %s", (token,))
    row = cur.fetchone()
    cur.close()
    return row and row[0] == 'admin'

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    headers = event.get('headers', {})
    token = headers.get('X-Authorization', '').replace('Bearer ', '').strip()

    conn = get_conn()
    try:
        # POST /admin/login — вход по паролю, выдаём admin токен
        if method == 'POST' and path.endswith('/login'):
            body = json.loads(event.get('body') or '{}')
            pwd = body.get('password', '')
            if pwd != ADMIN_PASSWORD:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Неверный пароль'})}
            cur = conn.cursor()
            cur.execute(f"SELECT id, session_token FROM {SCHEMA}.users WHERE role = 'admin' LIMIT 1")
            row = cur.fetchone()
            cur.close()
            if not row:
                return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': 'Нет аккаунта с правами admin'})}
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'token': row[1], 'ok': True})}

        if not check_admin(conn, token):
            return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': 'Нет доступа'})}

        # GET /admin/stats
        if method == 'GET' and path.endswith('/stats'):
            cur = conn.cursor()
            cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.servers WHERE status='active'")
            servers = cur.fetchone()[0]
            cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.users")
            users = cur.fetchone()[0]
            cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.servers WHERE is_online=TRUE")
            online = cur.fetchone()[0]
            cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.servers WHERE is_boosted=TRUE")
            boosts = cur.fetchone()[0]
            cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.orders WHERE status='paid'")
            orders_paid = cur.fetchone()[0]
            cur.close()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({
                'servers': servers, 'users': users, 'online_servers': online,
                'active_boosts': boosts, 'paid_orders': orders_paid
            })}

        # GET /admin/servers
        if method == 'GET' and path.endswith('/servers'):
            cur = conn.cursor()
            cur.execute(f"""
                SELECT s.id, s.name, s.game, s.status, s.is_online, s.is_boosted,
                       s.current_players, s.max_players, s.created_at, u.username
                FROM {SCHEMA}.servers s
                LEFT JOIN {SCHEMA}.users u ON s.owner_id = u.id
                ORDER BY s.created_at DESC LIMIT 100
            """)
            rows = cur.fetchall()
            cur.close()
            cols = ['id', 'name', 'game', 'status', 'is_online', 'is_boosted', 'current_players', 'max_players', 'created_at', 'owner']
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'servers': [dict(zip(cols, [str(v) if hasattr(v, 'isoformat') else v for v in r])) for r in rows]})}

        # PUT /admin/servers/{id}/status
        if method == 'PUT' and '/servers/' in path:
            parts = path.rstrip('/').split('/')
            server_id = None
            for p in parts:
                if p.isdigit():
                    server_id = int(p)
            if not server_id:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Не указан id'})}
            body = json.loads(event.get('body') or '{}')
            status = body.get('status', 'active')
            cur = conn.cursor()
            cur.execute(f"UPDATE {SCHEMA}.servers SET status=%s WHERE id=%s", (status, server_id))
            conn.commit()
            cur.close()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

        # GET /admin/users
        if method == 'GET' and path.endswith('/users'):
            cur = conn.cursor()
            cur.execute(f"""
                SELECT id, username, email, role, created_at,
                       (SELECT COUNT(*) FROM {SCHEMA}.servers WHERE owner_id = users.id) AS server_count
                FROM {SCHEMA}.users ORDER BY created_at DESC LIMIT 100
            """)
            rows = cur.fetchall()
            cur.close()
            cols = ['id', 'username', 'email', 'role', 'created_at', 'server_count']
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'users': [dict(zip(cols, [str(v) if hasattr(v, 'isoformat') else v for v in r])) for r in rows]})}

        # PUT /admin/users/{id}/role
        if method == 'PUT' and '/users/' in path:
            parts = path.rstrip('/').split('/')
            user_id = None
            for p in parts:
                if p.isdigit():
                    user_id = int(p)
            if not user_id:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Не указан id'})}
            body = json.loads(event.get('body') or '{}')
            role = body.get('role', 'user')
            if role not in ('user', 'premium', 'pro', 'admin'):
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Неверная роль'})}
            cur = conn.cursor()
            cur.execute(f"UPDATE {SCHEMA}.users SET role=%s WHERE id=%s", (role, user_id))
            conn.commit()
            cur.close()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

        return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Not found'})}

    finally:
        conn.close()
