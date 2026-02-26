
CREATE TABLE IF NOT EXISTS t_p84705017_gaming_server_monito.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    location VARCHAR(100),
    website VARCHAR(255),
    role VARCHAR(20) DEFAULT 'user',
    discord_id VARCHAR(100),
    discord_username VARCHAR(100),
    steam_id VARCHAR(100),
    steam_username VARCHAR(100),
    session_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p84705017_gaming_server_monito.servers (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES t_p84705017_gaming_server_monito.users(id),
    name VARCHAR(150) NOT NULL,
    game VARCHAR(50) NOT NULL,
    ip VARCHAR(100) NOT NULL,
    port INTEGER NOT NULL,
    map VARCHAR(100),
    max_players INTEGER DEFAULT 60,
    current_players INTEGER DEFAULT 0,
    version VARCHAR(50),
    description TEXT,
    tags TEXT[],
    discord VARCHAR(255),
    website VARCHAR(255),
    country VARCHAR(10) DEFAULT 'RU',
    image_url TEXT,
    is_online BOOLEAN DEFAULT FALSE,
    is_modded BOOLEAN DEFAULT FALSE,
    is_pvp BOOLEAN DEFAULT FALSE,
    is_rp BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    is_boosted BOOLEAN DEFAULT FALSE,
    boost_until TIMESTAMP,
    ping INTEGER DEFAULT 0,
    uptime NUMERIC(5,2) DEFAULT 100.0,
    rating NUMERIC(3,2) DEFAULT 0,
    votes_count INTEGER DEFAULT 0,
    rank INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p84705017_gaming_server_monito.server_history (
    id SERIAL PRIMARY KEY,
    server_id INTEGER REFERENCES t_p84705017_gaming_server_monito.servers(id),
    players INTEGER DEFAULT 0,
    recorded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p84705017_gaming_server_monito.votes (
    id SERIAL PRIMARY KEY,
    server_id INTEGER REFERENCES t_p84705017_gaming_server_monito.servers(id),
    user_id INTEGER REFERENCES t_p84705017_gaming_server_monito.users(id),
    ip_address VARCHAR(45),
    voted_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(server_id, user_id)
);

CREATE TABLE IF NOT EXISTS t_p84705017_gaming_server_monito.chat_messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p84705017_gaming_server_monito.users(id),
    username VARCHAR(50) NOT NULL,
    user_role VARCHAR(20) DEFAULT 'user',
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p84705017_gaming_server_monito.orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p84705017_gaming_server_monito.users(id),
    server_id INTEGER REFERENCES t_p84705017_gaming_server_monito.servers(id),
    product_type VARCHAR(50) NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    amount INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_servers_game ON t_p84705017_gaming_server_monito.servers(game);
CREATE INDEX IF NOT EXISTS idx_servers_rank ON t_p84705017_gaming_server_monito.servers(rank);
CREATE INDEX IF NOT EXISTS idx_server_history_sid ON t_p84705017_gaming_server_monito.server_history(server_id);
CREATE INDEX IF NOT EXISTS idx_chat_created ON t_p84705017_gaming_server_monito.chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_votes_server ON t_p84705017_gaming_server_monito.votes(server_id);
