"""
Общий чат: получение сообщений, отправка нового сообщения.
"""
import json
import os
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p84705017_gaming_server_monito')

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    headers = event.get('headers', {})
    token = headers.get('X-Authorization', '').replace('Bearer ', '').strip()
    params = event.get('queryStringParameters') or {}

    conn = get_conn()
    try:
        # GET — получить последние сообщения
        if method == 'GET':
            limit = min(int(params.get('limit', 50)), 100)
            cur = conn.cursor()
            cur.execute(
                f"""SELECT id, username, user_role, text, created_at
                    FROM {SCHEMA}.chat_messages
                    ORDER BY created_at DESC
                    LIMIT %s""",
                (limit,)
            )
            rows = cur.fetchall()
            cur.close()
            messages = [
                {
                    'id': r[0],
                    'user': r[1],
                    'role': r[2],
                    'text': r[3],
                    'time': str(r[4]),
                    'avatar': r[1][:2].upper() if r[1] else '??'
                }
                for r in reversed(rows)
            ]
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'messages': messages})}

        # POST — отправить сообщение
        if method == 'POST':
            body = json.loads(event.get('body') or '{}')
            text = (body.get('text') or '').strip()
            if not text:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Пустое сообщение'})}
            if len(text) > 500:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Слишком длинное сообщение'})}

            user = get_user_by_token(conn, token)
            username = user['username'] if user else 'Гость'
            user_role = user['role'] if user else 'user'
            user_id = user['id'] if user else None

            cur = conn.cursor()
            cur.execute(
                f"INSERT INTO {SCHEMA}.chat_messages (user_id, username, user_role, text) VALUES (%s, %s, %s, %s) RETURNING id, created_at",
                (user_id, username, user_role, text)
            )
            row = cur.fetchone()
            conn.commit()
            cur.close()
            return {
                'statusCode': 200,
                'headers': CORS,
                'body': json.dumps({
                    'message': {
                        'id': row[0],
                        'user': username,
                        'role': user_role,
                        'text': text,
                        'time': str(row[1]),
                        'avatar': username[:2].upper()
                    }
                })
            }

        return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Not found'})}

    finally:
        conn.close()
