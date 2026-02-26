"""
Аутентификация: регистрация, вход, выход, получение профиля, обновление профиля.
"""
import json
import os
import hashlib
import secrets
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p84705017_gaming_server_monito')

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def hash_password(pwd: str) -> str:
    return hashlib.sha256(pwd.encode()).hexdigest()

def make_token() -> str:
    return secrets.token_hex(32)

def get_user_by_token(conn, token: str):
    cur = conn.cursor()
    cur.execute(
        f"SELECT id, username, email, role, avatar_url, bio, location, website, discord_username, steam_username, created_at FROM {SCHEMA}.users WHERE session_token = %s",
        (token,)
    )
    row = cur.fetchone()
    cur.close()
    if not row:
        return None
    cols = ['id', 'username', 'email', 'role', 'avatar_url', 'bio', 'location', 'website', 'discord_username', 'steam_username', 'created_at']
    return dict(zip(cols, row))

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    headers = event.get('headers', {})
    token = headers.get('X-Authorization', '').replace('Bearer ', '').strip()

    conn = get_conn()
    try:
        # POST /register
        if method == 'POST' and path.endswith('/register'):
            body = json.loads(event.get('body') or '{}')
            username = (body.get('username') or '').strip()
            email = (body.get('email') or '').strip().lower()
            password = body.get('password') or ''

            if not username or not email or not password:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Заполни все поля'})}
            if len(password) < 6:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Пароль минимум 6 символов'})}

            cur = conn.cursor()
            cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = %s OR username = %s", (email, username))
            if cur.fetchone():
                cur.close()
                return {'statusCode': 409, 'headers': CORS, 'body': json.dumps({'error': 'Email или никнейм уже занят'})}

            new_token = make_token()
            cur.execute(
                f"INSERT INTO {SCHEMA}.users (username, email, password_hash, session_token) VALUES (%s, %s, %s, %s) RETURNING id, username, email, role",
                (username, email, hash_password(password), new_token)
            )
            row = cur.fetchone()
            conn.commit()
            cur.close()
            return {
                'statusCode': 200,
                'headers': CORS,
                'body': json.dumps({'token': new_token, 'user': {'id': row[0], 'username': row[1], 'email': row[2], 'role': row[3]}})
            }

        # POST /login
        if method == 'POST' and path.endswith('/login'):
            body = json.loads(event.get('body') or '{}')
            email = (body.get('email') or '').strip().lower()
            password = body.get('password') or ''

            cur = conn.cursor()
            cur.execute(
                f"SELECT id, username, email, role, avatar_url, bio, location, website FROM {SCHEMA}.users WHERE email = %s AND password_hash = %s",
                (email, hash_password(password))
            )
            row = cur.fetchone()
            if not row:
                cur.close()
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Неверный email или пароль'})}

            new_token = make_token()
            cur.execute(f"UPDATE {SCHEMA}.users SET session_token = %s WHERE id = %s", (new_token, row[0]))
            conn.commit()
            cur.close()
            cols = ['id', 'username', 'email', 'role', 'avatar_url', 'bio', 'location', 'website']
            return {
                'statusCode': 200,
                'headers': CORS,
                'body': json.dumps({'token': new_token, 'user': dict(zip(cols, row))})
            }

        # GET /me
        if method == 'GET' and path.endswith('/me'):
            if not token:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Не авторизован'})}
            user = get_user_by_token(conn, token)
            if not user:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Сессия истекла'})}
            user['created_at'] = str(user['created_at'])
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'user': user})}

        # PUT /me — обновление профиля
        if method == 'PUT' and path.endswith('/me'):
            if not token:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Не авторизован'})}
            user = get_user_by_token(conn, token)
            if not user:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Сессия истекла'})}
            body = json.loads(event.get('body') or '{}')
            bio = body.get('bio', user.get('bio', ''))
            location = body.get('location', user.get('location', ''))
            website = body.get('website', user.get('website', ''))
            cur = conn.cursor()
            cur.execute(
                f"UPDATE {SCHEMA}.users SET bio=%s, location=%s, website=%s, updated_at=NOW() WHERE id=%s",
                (bio, location, website, user['id'])
            )
            conn.commit()
            cur.close()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

        # POST /logout
        if method == 'POST' and path.endswith('/logout'):
            if token:
                cur = conn.cursor()
                cur.execute(f"UPDATE {SCHEMA}.users SET session_token = NULL WHERE session_token = %s", (token,))
                conn.commit()
                cur.close()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

        return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Not found'})}

    finally:
        conn.close()
