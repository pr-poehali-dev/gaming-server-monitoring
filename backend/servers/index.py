"""
Серверы: список, детали, добавление, обновление, удаление, голосование, история онлайна.
"""
import json
import os
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p84705017_gaming_server_monito')

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def get_user_by_token(conn, token: str):
    if not token:
        return None
    cur = conn.cursor()
    cur.execute(f"SELECT id, username, role FROM {SCHEMA}.users WHERE session_token = %s", (token,))
    row = cur.fetchone()
    cur.close()
    if not row:
        return None
    return {'id': row[0], 'username': row[1], 'role': row[2]}

def row_to_server(row, cols):
    s = dict(zip(cols, row))
    if s.get('tags') is None:
        s['tags'] = []
    for f in ['created_at', 'updated_at', 'boost_until']:
        if s.get(f):
            s[f] = str(s[f])
    for f in ['rating', 'uptime']:
        if s.get(f) is not None:
            s[f] = float(s[f])
    return s

SERVER_COLS = [
    'id', 'owner_id', 'name', 'game', 'ip', 'port', 'map', 'max_players',
    'current_players', 'version', 'description', 'tags', 'discord', 'website',
    'country', 'image_url', 'is_online', 'is_modded', 'is_pvp', 'is_rp',
    'is_premium', 'is_boosted', 'boost_until', 'ping', 'uptime', 'rating',
    'votes_count', 'rank', 'views', 'status', 'created_at', 'updated_at'
]

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    headers = event.get('headers', {})
    token = headers.get('X-Authorization', '').replace('Bearer ', '').strip()
    params = event.get('queryStringParameters') or {}

    conn = get_conn()
    try:
        # GET /servers или GET / — список серверов с фильтрацией
        if method == 'GET' and not any(x in path for x in ['/vote', '/history', '/my']):
            path_parts = path.rstrip('/').split('/')
            server_id = None
            for p in path_parts:
                if p.isdigit():
                    server_id = int(p)
                    break

            if server_id:
                cur = conn.cursor()
                cols_str = ', '.join(SERVER_COLS)
                cur.execute(
                    f"SELECT {cols_str} FROM {SCHEMA}.servers WHERE id = %s AND status = 'active'",
                    (server_id,)
                )
                cur.execute(f"UPDATE {SCHEMA}.servers SET views = views + 1 WHERE id = %s", (server_id,))
                conn.commit()
                row = cur.fetchone()
                cur.close()
                if not row:
                    return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Сервер не найден'})}
                return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'server': row_to_server(row, SERVER_COLS)})}

            game = params.get('game', '')
            sort = params.get('sort', 'rank')
            only_online = params.get('online', '') == '1'
            search = params.get('search', '')
            limit = min(int(params.get('limit', 50)), 100)
            offset = int(params.get('offset', 0))

            where = ["status = 'active'"]
            args = []
            if game:
                where.append("game = %s")
                args.append(game)
            if only_online:
                where.append("is_online = TRUE")
            if search:
                where.append("(name ILIKE %s OR map ILIKE %s)")
                args.extend([f'%{search}%', f'%{search}%'])

            order_map = {
                'rank': 'rank ASC, votes_count DESC',
                'players': 'current_players DESC',
                'rating': 'rating DESC',
                'ping': 'ping ASC',
                'votes': 'votes_count DESC',
                'new': 'created_at DESC',
            }
            order = order_map.get(sort, 'rank ASC, votes_count DESC')

            where_sql = ' AND '.join(where)
            cols_str = ', '.join(SERVER_COLS)
            args.extend([limit, offset])
            cur = conn.cursor()
            cur.execute(
                f"SELECT {cols_str} FROM {SCHEMA}.servers WHERE {where_sql} ORDER BY is_boosted DESC, {order} LIMIT %s OFFSET %s",
                args
            )
            rows = cur.fetchall()
            cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.servers WHERE {where_sql}", args[:-2])
            total = cur.fetchone()[0]
            cur.close()
            servers = [row_to_server(r, SERVER_COLS) for r in rows]
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'servers': servers, 'total': total})}

        # GET /servers/my — мои серверы
        if method == 'GET' and path.endswith('/my'):
            user = get_user_by_token(conn, token)
            if not user:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Не авторизован'})}
            cur = conn.cursor()
            cols_str = ', '.join(SERVER_COLS)
            cur.execute(f"SELECT {cols_str} FROM {SCHEMA}.servers WHERE owner_id = %s ORDER BY created_at DESC", (user['id'],))
            rows = cur.fetchall()
            cur.close()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'servers': [row_to_server(r, SERVER_COLS) for r in rows]})}

        # POST /servers — добавить сервер
        if method == 'POST' and path.endswith('/servers'):
            user = get_user_by_token(conn, token)
            if not user:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Нужно войти в аккаунт'})}
            body = json.loads(event.get('body') or '{}')
            name = (body.get('name') or '').strip()
            game = body.get('game', '')
            ip = (body.get('ip') or '').strip()
            port = int(body.get('port') or 0)
            if not name or not game or not ip or not port:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Заполни обязательные поля'})}

            cur = conn.cursor()
            cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.servers WHERE owner_id = %s AND status != 'banned'", (user['id'],))
            count = cur.fetchone()[0]
            max_servers = {'user': 1, 'premium': 5, 'pro': 999, 'admin': 999}.get(user['role'], 1)
            if count >= max_servers:
                cur.close()
                return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': f'Лимит серверов ({max_servers}) для твоего тарифа исчерпан'})}

            tags = body.get('tags', [])
            cur.execute(
                f"""INSERT INTO {SCHEMA}.servers
                (owner_id, name, game, ip, port, map, max_players, version, description, tags, discord, website, is_modded, is_pvp, is_rp)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id""",
                (
                    user['id'], name, game, ip, port,
                    body.get('map', ''), int(body.get('max_players') or 60),
                    body.get('version', ''), body.get('description', ''),
                    tags, body.get('discord', ''), body.get('website', ''),
                    body.get('is_modded', False), body.get('is_pvp', False), body.get('is_rp', False)
                )
            )
            server_id = cur.fetchone()[0]
            conn.commit()
            cur.close()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'id': server_id, 'ok': True})}

        # PUT /servers/{id}
        if method == 'PUT' and '/servers/' in path:
            user = get_user_by_token(conn, token)
            if not user:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Не авторизован'})}
            parts = path.rstrip('/').split('/')
            server_id = int(parts[-1])
            body = json.loads(event.get('body') or '{}')
            cur = conn.cursor()
            cur.execute(f"SELECT owner_id FROM {SCHEMA}.servers WHERE id = %s", (server_id,))
            row = cur.fetchone()
            if not row or (row[0] != user['id'] and user['role'] != 'admin'):
                cur.close()
                return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': 'Нет доступа'})}
            fields = ['name', 'map', 'max_players', 'version', 'description', 'tags', 'discord', 'website', 'is_modded', 'is_pvp', 'is_rp']
            updates = []
            vals = []
            for f in fields:
                if f in body:
                    updates.append(f"{f} = %s")
                    vals.append(body[f])
            if updates:
                vals.extend([server_id])
                cur.execute(f"UPDATE {SCHEMA}.servers SET {', '.join(updates)}, updated_at=NOW() WHERE id = %s", vals)
                conn.commit()
            cur.close()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

        # POST /servers/{id}/vote
        if method == 'POST' and '/vote' in path:
            user = get_user_by_token(conn, token)
            parts = path.rstrip('/').split('/')
            server_id = None
            for i, p in enumerate(parts):
                if p == 'vote' and i > 0 and parts[i-1].isdigit():
                    server_id = int(parts[i-1])
            if not server_id:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Не указан сервер'})}

            ip = (event.get('requestContext') or {}).get('identity', {}).get('sourceIp', '')
            cur = conn.cursor()
            if user:
                try:
                    cur.execute(f"INSERT INTO {SCHEMA}.votes (server_id, user_id, ip_address) VALUES (%s, %s, %s)", (server_id, user['id'], ip))
                except Exception:
                    cur.close()
                    conn.rollback()
                    return {'statusCode': 409, 'headers': CORS, 'body': json.dumps({'error': 'Ты уже голосовал за этот сервер'})}
            else:
                cur.execute(f"SELECT id FROM {SCHEMA}.votes WHERE server_id = %s AND ip_address = %s AND voted_at > NOW() - INTERVAL '24 hours'", (server_id, ip))
                if cur.fetchone():
                    cur.close()
                    return {'statusCode': 409, 'headers': CORS, 'body': json.dumps({'error': 'Уже голосовал (1 голос в 24ч)'})}
                cur.execute(f"INSERT INTO {SCHEMA}.votes (server_id, ip_address) VALUES (%s, %s)", (server_id, ip))

            cur.execute(f"UPDATE {SCHEMA}.servers SET votes_count = votes_count + 1 WHERE id = %s", (server_id,))
            conn.commit()
            cur.close()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

        # GET /servers/{id}/history
        if method == 'GET' and '/history' in path:
            parts = path.rstrip('/').split('/')
            server_id = None
            for i, p in enumerate(parts):
                if p == 'history' and i > 0 and parts[i-1].isdigit():
                    server_id = int(parts[i-1])
            if not server_id:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Не указан сервер'})}
            cur = conn.cursor()
            cur.execute(
                f"SELECT players, recorded_at FROM {SCHEMA}.server_history WHERE server_id = %s ORDER BY recorded_at DESC LIMIT 24",
                (server_id,)
            )
            rows = cur.fetchall()
            cur.close()
            history = [{'players': r[0], 'time': str(r[1])} for r in reversed(rows)]
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'history': history})}

        return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Not found'})}

    finally:
        conn.close()