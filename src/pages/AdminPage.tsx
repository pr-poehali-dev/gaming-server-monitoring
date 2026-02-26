import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { MOCK_SERVERS, GAMES } from '@/data/mockData';
import { adminApi } from '@/lib/api';

interface AdminPageProps {
  onNavigate: (page: string) => void;
}

interface AdminServer {
  id: number | string;
  name: string;
  game: string;
  owner?: string;
  is_online?: boolean;
  isOnline?: boolean;
  is_boosted?: boolean;
  isBoosted?: boolean;
  added_days?: number;
  addedDays?: number;
  status?: string;
}

interface AdminUser {
  id: number | string;
  username?: string;
  name?: string;
  email?: string;
  role?: string;
  plan?: string;
  servers_count?: number;
  servers?: number;
  created_at?: string;
  reg?: string;
}

interface AdminStats {
  total_servers?: number;
  total_users?: number;
  revenue?: number;
  active_boosts?: number;
}

export default function AdminPage({ onNavigate }: AdminPageProps) {
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [adminServers, setAdminServers] = useState<AdminServer[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  const login = async () => {
    setError('');
    setLoginLoading(true);
    try {
      const { status, data } = await adminApi.login(password);
      if (status === 200) {
        setIsAuth(true);
        setError('');
      } else {
        setError((data as { error?: string })?.error ?? 'Неверный пароль');
        setPassword('');
      }
    } catch {
      setError('Ошибка соединения');
      setPassword('');
    } finally {
      setLoginLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuth) return;
    setDataLoading(true);
    adminApi.stats().then(({ status, data }) => {
      if (status === 200) {
        setAdminStats(data as AdminStats);
      }
    }).catch(() => {}).finally(() => setDataLoading(false));
  }, [isAuth]);

  useEffect(() => {
    if (!isAuth || activeSection !== 'servers') return;
    adminApi.getServers().then(({ status, data }) => {
      if (status === 200 && Array.isArray(data?.servers)) {
        setAdminServers(data.servers);
      } else if (status === 200 && Array.isArray(data)) {
        setAdminServers(data as AdminServer[]);
      }
    }).catch(() => {});
  }, [isAuth, activeSection]);

  useEffect(() => {
    if (!isAuth || activeSection !== 'users') return;
    adminApi.getUsers().then(({ status, data }) => {
      if (status === 200 && Array.isArray(data?.users)) {
        setAdminUsers(data.users);
      } else if (status === 200 && Array.isArray(data)) {
        setAdminUsers(data as AdminUser[]);
      }
    }).catch(() => {});
  }, [isAuth, activeSection]);

  const handleUpdateServerStatus = async (id: number | string, status: string) => {
    const numId = typeof id === 'string' ? parseInt(id, 10) : id;
    await adminApi.updateServerStatus(numId, status).catch(() => {});
    setAdminServers(prev => prev.map(s => s.id === id ? { ...s, status, is_online: status === 'online' } : s));
  };

  const handleUpdateUserRole = async (id: number | string, role: string) => {
    const numId = typeof id === 'string' ? parseInt(id, 10) : id;
    await adminApi.updateUserRole(numId, role).catch(() => {});
    setAdminUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-sm animate-scale-in" style={{ opacity: 0 }}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4"
              style={{ background: '#ff6b3520', border: '1px solid #ff6b3540' }}>
              <Icon name="Shield" size={28} className="text-neon-orange" />
            </div>
            <h1 className="font-orbitron text-2xl font-black text-white">ADMIN PANEL</h1>
            <p className="text-gray-500 text-sm mt-2 font-golos">Доступ только для администраторов</p>
          </div>

          <div className="cyber-card rounded-xl p-6">
            <label className="block text-xs font-orbitron text-gray-500 mb-2">ПАРОЛЬ АДМИНИСТРАТОРА</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              placeholder="••••••••"
              className={`w-full bg-cyber-surface border rounded-md px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors font-golos mb-3 ${error ? 'border-red-500/50' : 'border-cyber-border focus:border-neon-orange/50'}`}
            />
            {error && <p className="text-red-400 text-xs mb-3 font-golos">{error}</p>}
            <button
              onClick={login}
              disabled={loginLoading}
              className="w-full py-3 rounded-md text-sm font-orbitron font-bold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: '#ff6b35', color: '#fff' }}>
              {loginLoading ? 'ЗАГРУЗКА...' : 'ВОЙТИ В ПАНЕЛЬ'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const SECTIONS = [
    { id: 'dashboard', label: 'Дашборд', icon: 'BarChart2' },
    { id: 'servers', label: 'Серверы', icon: 'Server' },
    { id: 'users', label: 'Пользователи', icon: 'Users' },
    { id: 'orders', label: 'Заказы', icon: 'ShoppingCart' },
    { id: 'reports', label: 'Жалобы', icon: 'Flag' },
    { id: 'settings', label: 'Настройки', icon: 'Settings' },
  ];

  const getStatValue = (key: keyof AdminStats, fallback: string) => {
    if (!adminStats) return fallback;
    const v = adminStats[key];
    if (v === undefined || v === null) return fallback;
    if (key === 'revenue') return `${Number(v).toLocaleString()}₽`;
    return Number(v).toLocaleString();
  };

  const STATS = [
    { label: 'Всего серверов', value: getStatValue('total_servers', '—'), change: '', icon: 'Server', color: '#00ff88' },
    { label: 'Пользователей', value: getStatValue('total_users', '—'), change: '', icon: 'Users', color: '#00d4ff' },
    { label: 'Доход (месяц)', value: getStatValue('revenue', '—'), change: '', icon: 'TrendingUp', color: '#ff6b35' },
    { label: 'Активные бусты', value: getStatValue('active_boosts', '—'), change: '', icon: 'Zap', color: '#ffd700' },
  ];

  const displayServers = adminServers.length > 0 ? adminServers : (MOCK_SERVERS as AdminServer[]);

  return (
    <div className="min-h-screen pt-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded font-orbitron font-bold" style={{ background: '#ff6b3520', color: '#ff6b35', border: '1px solid #ff6b3540' }}>ADMIN</span>
              <h1 className="font-orbitron text-2xl font-black text-white">ПАНЕЛЬ УПРАВЛЕНИЯ</h1>
            </div>
            <p className="text-gray-500 text-sm font-golos">SERVERZONE Admin v1.0</p>
          </div>
          <button onClick={() => setIsAuth(false)} className="cyber-btn-outline px-4 py-2 rounded-md text-xs bg-transparent" style={{ borderColor: '#ff224440', color: '#ff2244' }}>
            ВЫХОД
          </button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-48 shrink-0">
            <div className="cyber-card rounded-xl p-2 space-y-0.5">
              {SECTIONS.map(sec => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition-all font-golos ${activeSection === sec.id ? 'bg-neon-orange/10 text-neon-orange border border-neon-orange/20' : 'text-gray-400 hover:text-white hover:bg-cyber-surface'}`}>
                  <Icon name={sec.icon} size={16} />
                  {sec.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 animate-fade-in" style={{ opacity: 0 }}>
            {activeSection === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {STATS.map(stat => (
                    <div key={stat.label} className="cyber-card rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <Icon name={stat.icon} size={20} style={{ color: stat.color }} />
                        {stat.change && (
                          <span className="text-xs font-golos px-1.5 py-0.5 rounded" style={{ background: `${stat.color}20`, color: stat.color }}>{stat.change}</span>
                        )}
                      </div>
                      <div className="font-orbitron text-2xl font-black text-white">
                        {dataLoading ? <span className="animate-pulse text-gray-600">...</span> : stat.value}
                      </div>
                      <div className="text-xs text-gray-500 font-golos mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="cyber-card rounded-xl p-5">
                    <h3 className="font-orbitron text-sm font-bold text-white mb-4">ПОСЛЕДНИЕ СЕРВЕРЫ</h3>
                    <div className="space-y-2">
                      {displayServers.slice(0, 5).map(s => {
                        const mockS = s as typeof MOCK_SERVERS[0];
                        const game = GAMES.find(g => g.id === s.game);
                        const isOnline = s.is_online ?? mockS.isOnline ?? false;
                        const owner = s.owner ?? mockS.owner ?? '—';
                        const addedDays = s.added_days ?? mockS.addedDays ?? 0;
                        return (
                          <div key={s.id} className="flex items-center gap-3 py-2 border-b border-cyber-border/50">
                            <span className="text-lg">{game?.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-white truncate font-golos">{s.name}</div>
                              <div className="text-xs text-gray-500 font-golos">{owner} • {addedDays}д назад</div>
                            </div>
                            <div className="flex gap-1">
                              <span className={`text-xs px-1.5 py-0.5 rounded font-orbitron ${isOnline ? 'text-neon-green bg-neon-green/10' : 'text-red-400 bg-red-900/20'}`}>
                                {isOnline ? 'ON' : 'OFF'}
                              </span>
                              <button className="text-xs px-1.5 py-0.5 rounded text-red-400 hover:bg-red-900/20 transition-colors font-orbitron">
                                DEL
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="cyber-card rounded-xl p-5">
                    <h3 className="font-orbitron text-sm font-bold text-white mb-4">РАСПРЕДЕЛЕНИЕ ПО ИГРАМ</h3>
                    <div className="space-y-3">
                      {[
                        { game: 'DayZ', count: 1240, pct: 44, color: '#ff6b35' },
                        { game: 'Rust', count: 680, pct: 24, color: '#cd412b' },
                        { game: 'Minecraft', count: 510, pct: 18, color: '#5dba3f' },
                        { game: 'CS 2', count: 284, pct: 10, color: '#f0a500' },
                        { game: 'Другие', count: 133, pct: 4, color: '#666' },
                      ].map(item => (
                        <div key={item.game}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400 font-golos">{item.game}</span>
                            <span className="font-orbitron text-white">{item.count}</span>
                          </div>
                          <div className="h-1.5 bg-cyber-border rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: item.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'servers' && (
              <div className="cyber-card rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-cyber-border">
                  <h3 className="font-orbitron text-sm font-bold text-white">УПРАВЛЕНИЕ СЕРВЕРАМИ</h3>
                  <input placeholder="Поиск..." className="bg-cyber-surface border border-cyber-border rounded-md px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/50 font-golos" />
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cyber-border">
                      {['ID', 'Сервер', 'Игра', 'Владелец', 'Статус', 'Буст', 'Действия'].map(h => (
                        <th key={h} className="text-left p-3 text-xs font-orbitron text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayServers.map(s => {
                      const mockS = s as typeof MOCK_SERVERS[0];
                      const game = GAMES.find(g => g.id === s.game);
                      const isOnline = s.is_online ?? mockS.isOnline ?? false;
                      const isBoosted = s.is_boosted ?? mockS.isBoosted ?? false;
                      const owner = s.owner ?? mockS.owner ?? '—';
                      return (
                        <tr key={s.id} className="border-b border-cyber-border/50 hover:bg-cyber-surface/50 transition-colors">
                          <td className="p-3 font-orbitron text-xs text-gray-500">#{s.id}</td>
                          <td className="p-3 text-sm text-white font-golos max-w-[150px] truncate">{s.name}</td>
                          <td className="p-3 text-xs text-gray-400 font-golos">{game?.icon} {game?.name?.split(' ')[0]}</td>
                          <td className="p-3 text-xs text-gray-400 font-golos">{owner}</td>
                          <td className="p-3">
                            <select
                              value={isOnline ? 'online' : 'offline'}
                              onChange={e => handleUpdateServerStatus(s.id, e.target.value)}
                              className={`text-xs px-1.5 py-0.5 rounded font-orbitron bg-transparent border-0 cursor-pointer ${isOnline ? 'text-neon-green' : 'text-red-400'}`}>
                              <option value="online">ONLINE</option>
                              <option value="offline">OFFLINE</option>
                            </select>
                          </td>
                          <td className="p-3">
                            {isBoosted ? (
                              <span className="text-xs px-1.5 py-0.5 rounded font-orbitron" style={{ background: '#ff6b3520', color: '#ff6b35' }}>BOOST</span>
                            ) : <span className="text-gray-600 text-xs">—</span>}
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <button className="p-1 rounded text-gray-400 hover:text-neon-green transition-colors"><Icon name="Edit" size={13} /></button>
                              <button className="p-1 rounded text-gray-400 hover:text-red-400 transition-colors"><Icon name="Trash2" size={13} /></button>
                              <button className="p-1 rounded text-gray-400 hover:text-yellow-400 transition-colors"><Icon name="Eye" size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {activeSection === 'users' && (
              <div className="cyber-card rounded-xl overflow-hidden">
                <div className="p-4 border-b border-cyber-border">
                  <h3 className="font-orbitron text-sm font-bold text-white">ПОЛЬЗОВАТЕЛИ</h3>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cyber-border">
                      {['Пользователь', 'Email', 'Статус', 'Серверов', 'Регистрация', 'Действия'].map(h => (
                        <th key={h} className="text-left p-3 text-xs font-orbitron text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {adminUsers.length > 0 ? adminUsers.map(u => {
                      const role = u.role ?? u.plan ?? 'FREE';
                      const roleColor = role === 'admin' ? '#ff6b35' : role === 'premium' || role === 'PREMIUM' ? '#00ff88' : '#666';
                      const username = u.username ?? u.name ?? '—';
                      const serversCount = u.servers_count ?? u.servers ?? 0;
                      const regDate = u.created_at ?? u.reg ?? '—';
                      return (
                        <tr key={u.id} className="border-b border-cyber-border/50 hover:bg-cyber-surface/50">
                          <td className="p-3 font-golos text-sm text-white">{username}</td>
                          <td className="p-3 text-xs text-gray-500 font-golos">{u.email ?? '—'}</td>
                          <td className="p-3">
                            <select
                              value={role}
                              onChange={e => handleUpdateUserRole(u.id, e.target.value)}
                              className="text-xs px-1.5 py-0.5 rounded font-orbitron bg-transparent border-0 cursor-pointer"
                              style={{ color: roleColor }}>
                              <option value="user">USER</option>
                              <option value="premium">PREMIUM</option>
                              <option value="admin">ADMIN</option>
                            </select>
                          </td>
                          <td className="p-3 font-orbitron text-sm text-white">{serversCount}</td>
                          <td className="p-3 text-xs text-gray-500 font-golos">{regDate}</td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <button className="p-1 rounded text-gray-400 hover:text-neon-green transition-colors"><Icon name="Edit" size={13} /></button>
                              <button className="p-1 rounded text-gray-400 hover:text-red-400 transition-colors"><Icon name="Ban" size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    }) : (
                      [{
                        name: 'NuclearAdmin', email: 'nuclear@mail.ru', plan: 'ADMIN', servers: 3, reg: '182 дня назад', color: '#ff6b35',
                      },
                      { name: 'StalkerPro', email: 'stalker@mail.ru', plan: 'PREMIUM', servers: 2, reg: '95 дней назад', color: '#00ff88' },
                      { name: 'RustKing', email: 'rust@mail.ru', plan: 'PRO', servers: 5, reg: '210 дней назад', color: '#ff6b35' },
                      { name: 'ZombieHunter', email: 'zombie@mail.ru', plan: 'FREE', servers: 1, reg: '30 дней назад', color: '#666' },
                      { name: 'PixelMaster', email: 'pixel@mail.ru', plan: 'PREMIUM', servers: 2, reg: '365 дней назад', color: '#00ff88' },
                      ].map(u => (
                        <tr key={u.name} className="border-b border-cyber-border/50 hover:bg-cyber-surface/50">
                          <td className="p-3 font-golos text-sm text-white">{u.name}</td>
                          <td className="p-3 text-xs text-gray-500 font-golos">{u.email}</td>
                          <td className="p-3">
                            <span className="text-xs px-1.5 py-0.5 rounded font-orbitron font-bold" style={{ background: `${u.color}20`, color: u.color }}>{u.plan}</span>
                          </td>
                          <td className="p-3 font-orbitron text-sm text-white">{u.servers}</td>
                          <td className="p-3 text-xs text-gray-500 font-golos">{u.reg}</td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <button className="p-1 rounded text-gray-400 hover:text-neon-green transition-colors"><Icon name="Edit" size={13} /></button>
                              <button className="p-1 rounded text-gray-400 hover:text-red-400 transition-colors"><Icon name="Ban" size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeSection === 'orders' && (
              <div className="cyber-card rounded-xl overflow-hidden">
                <div className="p-4 border-b border-cyber-border">
                  <h3 className="font-orbitron text-sm font-bold text-white">ЗАКАЗЫ И ОПЛАТЫ</h3>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cyber-border">
                      {['#', 'Пользователь', 'Товар', 'Сумма', 'Статус', 'Дата'].map(h => (
                        <th key={h} className="text-left p-3 text-xs font-orbitron text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: '1001', user: 'NuclearAdmin', product: 'Premium Boost 30д', sum: '499₽', status: 'paid', date: '25.02.2026' },
                      { id: '1002', user: 'RustKing', product: 'PRO Подписка', sum: '799₽', status: 'paid', date: '24.02.2026' },
                      { id: '1003', user: 'StalkerPro', product: 'Баннер главная', sum: '1,990₽', status: 'pending', date: '23.02.2026' },
                      { id: '1004', user: 'PixelMaster', product: 'Premium Подписка', sum: '299₽', status: 'paid', date: '22.02.2026' },
                    ].map(order => (
                      <tr key={order.id} className="border-b border-cyber-border/50 hover:bg-cyber-surface/50">
                        <td className="p-3 font-orbitron text-xs text-gray-500">#{order.id}</td>
                        <td className="p-3 text-sm text-white font-golos">{order.user}</td>
                        <td className="p-3 text-xs text-gray-400 font-golos">{order.product}</td>
                        <td className="p-3 font-orbitron text-sm text-neon-green">{order.sum}</td>
                        <td className="p-3">
                          <span className={`text-xs px-1.5 py-0.5 rounded font-orbitron ${order.status === 'paid' ? 'text-neon-green bg-neon-green/10' : 'text-yellow-400 bg-yellow-900/20'}`}>
                            {order.status === 'paid' ? 'ОПЛАЧЕНО' : 'ОЖИДАНИЕ'}
                          </span>
                        </td>
                        <td className="p-3 text-xs text-gray-500 font-golos">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeSection === 'reports' && (
              <div className="space-y-3">
                {[
                  { user: 'ZombieHunter', target: 'NUCLEAR WASTELAND', reason: 'Некорректная информация', date: '25.02.2026', status: 'new' },
                  { user: 'AnonymousUser', target: 'DEAD WORLD', reason: 'Неактивный сервер', date: '24.02.2026', status: 'resolved' },
                  { user: 'CsProPlayer', target: 'CS 1.6 OLD SCHOOL', reason: 'Спам в описании', date: '23.02.2026', status: 'new' },
                ].map((report, i) => (
                  <div key={i} className="cyber-card rounded-xl p-4 flex items-start gap-4">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${report.status === 'new' ? 'bg-neon-orange' : 'bg-gray-600'}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-orbitron text-sm font-bold text-white">{report.target}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded font-orbitron ${report.status === 'new' ? 'text-neon-orange bg-neon-orange/10' : 'text-gray-500 bg-cyber-border'}`}>
                          {report.status === 'new' ? 'НОВАЯ' : 'РЕШЕНО'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 font-golos mb-1">{report.reason}</p>
                      <div className="text-xs text-gray-600 font-golos">От: {report.user} • {report.date}</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 rounded text-xs font-orbitron text-neon-green border border-neon-green/30 hover:bg-neon-green/10 transition-colors">РЕШИТЬ</button>
                      <button className="px-3 py-1.5 rounded text-xs font-orbitron text-red-400 border border-red-400/30 hover:bg-red-900/10 transition-colors">УДАЛИТЬ</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'settings' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="cyber-card rounded-xl p-5">
                  <h3 className="font-orbitron text-sm font-bold text-white mb-4">НАСТРОЙКИ САЙТА</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Название сайта', value: 'SERVERZONE' },
                      { label: 'Email поддержки', value: 'support@serverzone.ru' },
                      { label: 'Telegram канал', value: '@serverzone' },
                    ].map(s => (
                      <div key={s.label}>
                        <label className="block text-xs font-orbitron text-gray-500 mb-1">{s.label.toUpperCase()}</label>
                        <input defaultValue={s.value}
                          className="w-full bg-cyber-surface border border-cyber-border rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-neon-green/50 font-golos" />
                      </div>
                    ))}
                    <button className="cyber-btn-green w-full py-2.5 rounded-md text-sm">СОХРАНИТЬ</button>
                  </div>
                </div>
                <div className="cyber-card rounded-xl p-5">
                  <h3 className="font-orbitron text-sm font-bold text-white mb-4">ПЕРЕКЛЮЧАТЕЛИ</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Регистрация открыта', enabled: true },
                      { label: 'Технические работы', enabled: false },
                      { label: 'Авто-проверка серверов', enabled: true },
                      { label: 'Email уведомления', enabled: true },
                    ].map(toggle => (
                      <div key={toggle.label} className="flex items-center justify-between py-2 border-b border-cyber-border/50">
                        <span className="text-sm text-gray-300 font-golos">{toggle.label}</span>
                        <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${toggle.enabled ? 'bg-neon-green' : 'bg-cyber-border'}`}>
                          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${toggle.enabled ? 'right-0.5' : 'left-0.5'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
