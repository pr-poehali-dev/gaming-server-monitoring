import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { MOCK_SERVERS, GAMES } from '@/data/mockData';

interface AdminPageProps {
  onNavigate: (page: string) => void;
}

const ADMIN_PASSWORD = 'admin2077';

export default function AdminPage({ onNavigate }: AdminPageProps) {
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuth(true);
      setError('');
    } else {
      setError('Неверный пароль');
      setPassword('');
    }
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
            <button onClick={login} className="w-full py-3 rounded-md text-sm font-orbitron font-bold transition-all hover:opacity-90"
              style={{ background: '#ff6b35', color: '#fff' }}>
              ВОЙТИ В ПАНЕЛЬ
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

  const STATS = [
    { label: 'Всего серверов', value: '2,847', change: '+12', icon: 'Server', color: '#00ff88' },
    { label: 'Пользователей', value: '48,291', change: '+234', icon: 'Users', color: '#00d4ff' },
    { label: 'Доход (месяц)', value: '148,920₽', change: '+18%', icon: 'TrendingUp', color: '#ff6b35' },
    { label: 'Активные бусты', value: '342', change: '+28', icon: 'Zap', color: '#ffd700' },
  ];

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
                        <span className="text-xs font-golos px-1.5 py-0.5 rounded" style={{ background: `${stat.color}20`, color: stat.color }}>{stat.change}</span>
                      </div>
                      <div className="font-orbitron text-2xl font-black text-white">{stat.value}</div>
                      <div className="text-xs text-gray-500 font-golos mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="cyber-card rounded-xl p-5">
                    <h3 className="font-orbitron text-sm font-bold text-white mb-4">ПОСЛЕДНИЕ СЕРВЕРЫ</h3>
                    <div className="space-y-2">
                      {MOCK_SERVERS.slice(0, 5).map(s => {
                        const game = GAMES.find(g => g.id === s.game);
                        return (
                          <div key={s.id} className="flex items-center gap-3 py-2 border-b border-cyber-border/50">
                            <span className="text-lg">{game?.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-white truncate font-golos">{s.name}</div>
                              <div className="text-xs text-gray-500 font-golos">{s.owner} • {s.addedDays}д назад</div>
                            </div>
                            <div className="flex gap-1">
                              <span className={`text-xs px-1.5 py-0.5 rounded font-orbitron ${s.isOnline ? 'text-neon-green bg-neon-green/10' : 'text-red-400 bg-red-900/20'}`}>
                                {s.isOnline ? 'ON' : 'OFF'}
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
                    {MOCK_SERVERS.map(s => {
                      const game = GAMES.find(g => g.id === s.game);
                      return (
                        <tr key={s.id} className="border-b border-cyber-border/50 hover:bg-cyber-surface/50 transition-colors">
                          <td className="p-3 font-orbitron text-xs text-gray-500">#{s.id}</td>
                          <td className="p-3 text-sm text-white font-golos max-w-[150px] truncate">{s.name}</td>
                          <td className="p-3 text-xs text-gray-400 font-golos">{game?.icon} {game?.name.split(' ')[0]}</td>
                          <td className="p-3 text-xs text-gray-400 font-golos">{s.owner}</td>
                          <td className="p-3">
                            <span className={`text-xs px-1.5 py-0.5 rounded font-orbitron ${s.isOnline ? 'text-neon-green bg-neon-green/10' : 'text-red-400 bg-red-900/20'}`}>
                              {s.isOnline ? 'ONLINE' : 'OFFLINE'}
                            </span>
                          </td>
                          <td className="p-3">
                            {s.isBoosted ? (
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
                    {[
                      { name: 'NuclearAdmin', email: 'nuclear@mail.ru', plan: 'ADMIN', servers: 3, reg: '182 дня назад', color: '#ff6b35' },
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
                    ))}
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
                  <div key={i} className="cyber-card rounded-xl p-4 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: report.status === 'new' ? '#ff224420' : '#00ff8820' }}>
                        <Icon name="Flag" size={14} style={{ color: report.status === 'new' ? '#ff2244' : '#00ff88' }} />
                      </div>
                      <div>
                        <div className="text-sm text-white font-golos"><strong>{report.user}</strong> жалуется на <strong className="text-neon-green">{report.target}</strong></div>
                        <div className="text-xs text-gray-500 font-golos mt-0.5">{report.reason} • {report.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-orbitron ${report.status === 'new' ? 'text-red-400 bg-red-900/20' : 'text-neon-green bg-neon-green/10'}`}>
                        {report.status === 'new' ? 'НОВАЯ' : 'РЕШЕНА'}
                      </span>
                      {report.status === 'new' && (
                        <button className="text-xs px-2 py-1 rounded font-orbitron" style={{ background: '#00ff8820', color: '#00ff88', border: '1px solid #00ff8840' }}>
                          РЕШИТЬ
                        </button>
                      )}
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
                      { label: 'Минимальная цена буста', value: '199' },
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
