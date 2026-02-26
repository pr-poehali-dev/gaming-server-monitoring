const URLS = {
  auth: 'https://functions.poehali.dev/62010ae6-371b-47a0-ab6c-728bb17392d2',
  servers: 'https://functions.poehali.dev/7b94d80f-12c8-468e-8bbb-f9e06eabd4b8',
  chat: 'https://functions.poehali.dev/be260ad9-51f4-48e4-9822-fe4c1379c1b7',
  admin: 'https://functions.poehali.dev/a979ea4e-6125-4cca-bb39-a74d2f375f5a',
};

function getToken(): string {
  return localStorage.getItem('sz_token') || '';
}

function setToken(token: string) {
  localStorage.setItem('sz_token', token);
}

function clearToken() {
  localStorage.removeItem('sz_token');
  localStorage.removeItem('sz_user');
}

function saveUser(user: object) {
  localStorage.setItem('sz_user', JSON.stringify(user));
}

function getStoredUser() {
  try {
    const s = localStorage.getItem('sz_user');
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

async function request(base: string, path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${base}${path}`, { ...options, headers });
  const data = await res.json();
  return { status: res.status, data };
}

// AUTH
export const auth = {
  async register(username: string, email: string, password: string) {
    const { status, data } = await request(URLS.auth, '/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
    if (status === 200 && data.token) {
      setToken(data.token);
      saveUser(data.user);
    }
    return { status, data };
  },

  async login(email: string, password: string) {
    const { status, data } = await request(URLS.auth, '/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (status === 200 && data.token) {
      setToken(data.token);
      saveUser(data.user);
    }
    return { status, data };
  },

  async me() {
    const { status, data } = await request(URLS.auth, '/me');
    if (status === 200 && data.user) {
      saveUser(data.user);
    }
    return { status, data };
  },

  async updateProfile(fields: { bio?: string; location?: string; website?: string }) {
    return request(URLS.auth, '/me', {
      method: 'PUT',
      body: JSON.stringify(fields),
    });
  },

  async logout() {
    await request(URLS.auth, '/logout', { method: 'POST' });
    clearToken();
  },

  getStoredUser,
  getToken,
  isLoggedIn: () => !!getToken(),
};

// SERVERS
export const servers = {
  async list(params: { game?: string; sort?: string; online?: boolean; search?: string; limit?: number; offset?: number } = {}) {
    const q = new URLSearchParams();
    if (params.game) q.set('game', params.game);
    if (params.sort) q.set('sort', params.sort);
    if (params.online) q.set('online', '1');
    if (params.search) q.set('search', params.search);
    if (params.limit) q.set('limit', String(params.limit));
    if (params.offset) q.set('offset', String(params.offset));
    const qs = q.toString();
    return request(URLS.servers, qs ? `/?${qs}` : '/');
  },

  async get(id: number) {
    return request(URLS.servers, `/${id}`);
  },

  async my() {
    return request(URLS.servers, '/my');
  },

  async create(data: object) {
    return request(URLS.servers, '/servers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: object) {
    return request(URLS.servers, `/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async vote(serverId: number) {
    return request(URLS.servers, `/${serverId}/vote`, { method: 'POST' });
  },

  async history(serverId: number) {
    return request(URLS.servers, `/${serverId}/history`);
  },
};

// CHAT
export const chat = {
  async getMessages(limit = 50) {
    return request(URLS.chat, `/?limit=${limit}`);
  },

  async send(text: string) {
    return request(URLS.chat, '/', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },
};

// ADMIN
export const adminApi = {
  async login(password: string) {
    const { status, data } = await request(URLS.admin, '/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
    if (status === 200 && data.token) {
      setToken(data.token);
    }
    return { status, data };
  },

  async stats() {
    return request(URLS.admin, '/stats');
  },

  async getServers() {
    return request(URLS.admin, '/servers');
  },

  async updateServerStatus(id: number, status: string) {
    return request(URLS.admin, `/servers/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  async getUsers() {
    return request(URLS.admin, '/users');
  },

  async updateUserRole(id: number, role: string) {
    return request(URLS.admin, `/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },
};
