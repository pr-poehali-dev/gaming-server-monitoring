import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

const TABS = [
  { id: 'profile', label: 'Профиль', icon: 'User' },
  { id: 'servers', label: 'Мои серверы', icon: 'Server' },
  { id: 'accounts', label: 'Аккаунты', icon: 'Link' },
  { id: 'security', label: 'Безопасность', icon: 'Shield' },
];

export default function ProfilePage({ onNavigate }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ email: '', password: '', username: '', confirmPassword: '' });
  const [profile, setProfile] = useState({ username: 'NuclearAdmin', bio: 'Создаю лучшие DayZ серверы', location: 'Москва', website: '' });

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-8">
        <div className="w-full max-w-md animate-scale-in" style={{ opacity: 0 }}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4" style={{ background: '#00ff8820', border: '1px solid #00ff8840' }}>
              <Icon name="User" size={28} className="text-neon-green" />
            </div>
            <h1 className="font-orbitron text-2xl font-black text-white">
              {authMode === 'login' ? 'ВХОД В АККАУНТ' : 'РЕГИСТРАЦИЯ'}
            </h1>
            <p className="text-gray-500 text-sm mt-2 font-golos">
              {authMode === 'login' ? 'Войди для управления серверами' : 'Создай аккаунт бесплатно'}
            </p>
          </div>

          <div className="cyber-card rounded-xl p-6">
            {authMode === 'register' && (
              <div className="mb-4">
                <label className="block text-xs font-orbitron text-gray-500 mb-2">НИКНЕЙМ</label>
                <input
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  placeholder="GameMaster2077"
                  className="w-full bg-cyber-surface border border-cyber-border rounded-md px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/50 transition-colors font-golos"
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-xs font-orbitron text-gray-500 mb-2">EMAIL</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="gamer@example.com"
                className="w-full bg-cyber-surface border border-cyber-border rounded-md px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/50 transition-colors font-golos"
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-orbitron text-gray-500 mb-2">ПАРОЛЬ</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-cyber-surface border border-cyber-border rounded-md px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/50 transition-colors font-golos"
              />
            </div>
            {authMode === 'register' && (
              <div className="mb-4">
                <label className="block text-xs font-orbitron text-gray-500 mb-2">ПОДТВЕРДИ ПАРОЛЬ</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-cyber-surface border border-cyber-border rounded-md px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/50 transition-colors font-golos"
                />
              </div>
            )}

            <button onClick={() => setIsLoggedIn(true)} className="cyber-btn-green w-full py-3 rounded-md text-sm mb-4">
              {authMode === 'login' ? 'ВОЙТИ' : 'ЗАРЕГИСТРИРОВАТЬСЯ'}
            </button>

            <div className="relative my-4">
              <div className="border-t border-cyber-border" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="bg-cyber-card px-3 text-xs text-gray-600 font-golos">или войти через</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-2.5 rounded-md border border-cyber-border hover:border-[#5865f260] hover:bg-[#5865f210] transition-all text-sm text-gray-400 font-golos">
                <div className="w-5 h-5 rounded flex items-center justify-center text-white font-bold text-xs" style={{ background: '#5865f2' }}>D</div>
                Discord
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 rounded-md border border-cyber-border hover:border-[#66c0f460] hover:bg-[#66c0f410] transition-all text-sm text-gray-400 font-golos">
                <div className="w-5 h-5 rounded flex items-center justify-center text-white font-bold text-xs" style={{ background: '#1b2838' }}>S</div>
                Steam
              </button>
            </div>

            <p className="text-center text-sm mt-4 text-gray-500 font-golos">
              {authMode === 'login' ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-neon-green hover:underline">
                {authMode === 'login' ? 'Зарегистрироваться' : 'Войти'}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8">
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="cyber-card rounded-xl p-6 mb-6 animate-fade-in" style={{ opacity: 0 }}>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-xl flex items-center justify-center font-orbitron font-black text-2xl"
                style={{ background: 'linear-gradient(135deg, #00ff88, #00cc6a)', color: '#0a0a0f' }}>
                NA
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-md flex items-center justify-center"
                style={{ background: '#0f0f1a', border: '1px solid #1a1a2e' }}>
                <Icon name="Camera" size={12} className="text-gray-400" />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-orbitron text-2xl font-black text-white">{profile.username}</h1>
                <span className="text-xs px-2 py-0.5 rounded font-orbitron font-bold" style={{ background: '#ff6b3520', color: '#ff6b35', border: '1px solid #ff6b3540' }}>ADMIN</span>
                <span className="text-xs px-2 py-0.5 rounded font-orbitron font-bold" style={{ background: '#00ff8820', color: '#00ff88', border: '1px solid #00ff8840' }}>PRO</span>
              </div>
              <p className="text-gray-400 text-sm font-golos">{profile.bio}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 font-golos">
                <span className="flex items-center gap-1"><Icon name="MapPin" size={12} /> {profile.location}</span>
                <span className="flex items-center gap-1"><Icon name="Calendar" size={12} /> Участник 182 дня</span>
                <span className="flex items-center gap-1"><Icon name="Server" size={12} /> 3 сервера</span>
              </div>
            </div>
            <button onClick={() => setIsLoggedIn(false)} className="cyber-btn-outline px-4 py-2 rounded-md text-xs bg-transparent ml-auto" style={{ borderColor: '#ff224440', color: '#ff2244' }}>
              ВЫЙТИ
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-5 pt-5 border-t border-cyber-border">
            {[
              { label: 'Серверов', value: '3' },
              { label: 'Голосов', value: '2,847' },
              { label: 'Просмотров', value: '48.2K' },
              { label: 'Рейтинг', value: '#4' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="font-orbitron text-xl font-bold neon-text-green">{stat.value}</div>
                <div className="text-xs text-gray-500 font-golos">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-cyber-card rounded-xl p-1 border border-cyber-border">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 flex-1 justify-center py-2.5 px-3 rounded-lg text-sm transition-all font-orbitron ${activeTab === tab.id ? 'bg-neon-green text-cyber-dark font-bold' : 'text-gray-500 hover:text-white'}`}>
              <Icon name={tab.icon} size={14} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in" style={{ opacity: 0 }}>
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="cyber-card rounded-xl p-5">
                <h3 className="font-orbitron text-sm font-bold text-white mb-4">ЛИЧНЫЕ ДАННЫЕ</h3>
                <div className="space-y-4">
                  {[
                    { label: 'НИКНЕЙМ', key: 'username', value: profile.username },
                    { label: 'О СЕБЕ', key: 'bio', value: profile.bio },
                    { label: 'ЛОКАЦИЯ', key: 'location', value: profile.location },
                    { label: 'САЙТ', key: 'website', value: profile.website },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-xs font-orbitron text-gray-500 mb-1.5">{field.label}</label>
                      <input
                        value={field.value}
                        onChange={e => setProfile({ ...profile, [field.key]: e.target.value })}
                        className="w-full bg-cyber-surface border border-cyber-border rounded-md px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/50 transition-colors font-golos"
                      />
                    </div>
                  ))}
                  <button className="cyber-btn-green w-full py-2.5 rounded-md text-sm">
                    СОХРАНИТЬ ИЗМЕНЕНИЯ
                  </button>
                </div>
              </div>
              <div className="cyber-card rounded-xl p-5">
                <h3 className="font-orbitron text-sm font-bold text-white mb-4">ПОДПИСКА</h3>
                <div className="p-4 rounded-lg border mb-4" style={{ background: '#00ff8808', borderColor: '#00ff8840' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-orbitron font-black text-neon-green text-xl">PREMIUM</span>
                    <span className="text-xs px-2 py-0.5 rounded text-neon-green border border-neon-green/30 font-golos">Активна</span>
                  </div>
                  <p className="text-gray-400 text-xs font-golos mb-3">Истекает: 15 марта 2026</p>
                  <div className="space-y-1">
                    {['5 серверов', 'Расширенная статистика', 'История 30 дней', 'Discord интеграция'].map(f => (
                      <div key={f} className="flex items-center gap-2 text-xs text-gray-400 font-golos">
                        <Icon name="Check" size={12} className="text-neon-green" /> {f}
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => onNavigate('shop')} className="cyber-btn-outline w-full py-2.5 rounded-md text-sm bg-transparent">
                  УЛУЧШИТЬ ДО PRO
                </button>
              </div>
            </div>
          )}

          {activeTab === 'servers' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-orbitron text-sm font-bold text-white">МОИ СЕРВЕРЫ (3/5)</h3>
                <button onClick={() => onNavigate('add-server')} className="cyber-btn-green px-4 py-2 rounded-md text-xs">
                  + ДОБАВИТЬ
                </button>
              </div>
              <div className="space-y-3">
                {['NUCLEAR WASTELAND #1', 'DEAD ZONE PVP', 'NAMALSK SURVIVAL'].map((name, i) => (
                  <div key={name} className="cyber-card rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center font-orbitron font-black"
                      style={{ background: '#ff6b3520', color: '#ff6b35', border: '1px solid #ff6b3540' }}>
                      🧟
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white text-sm">{name}</div>
                      <div className="text-xs text-gray-500 font-golos">DayZ • 185.244.120.{i + 1}:2302</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="online-dot" />
                      <span className="text-neon-green text-sm font-orbitron font-bold">{[48, 23, 12][i]}</span>
                      <span className="text-gray-600 text-xs font-golos">/{[60, 40, 30][i]}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-md border border-cyber-border hover:border-neon-green/50 hover:text-neon-green transition-all text-gray-400">
                        <Icon name="Edit" size={14} />
                      </button>
                      <button className="p-2 rounded-md border border-cyber-border hover:border-red-500/50 hover:text-red-400 transition-all text-gray-400">
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'accounts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  name: 'Discord',
                  color: '#5865f2',
                  bg: '#5865f210',
                  icon: 'D',
                  connected: true,
                  username: 'NuclearAdmin#1337',
                  desc: 'Получай уведомления в Discord о событиях на серверах'
                },
                {
                  name: 'Steam',
                  color: '#66c0f4',
                  bg: '#66c0f410',
                  icon: 'S',
                  connected: false,
                  username: '',
                  desc: 'Привяжи Steam для верификации и автозаполнения данных'
                },
              ].map(acc => (
                <div key={acc.name} className="cyber-card rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ background: acc.color }}>
                      {acc.icon}
                    </div>
                    <div>
                      <div className="font-orbitron font-bold text-white">{acc.name}</div>
                      {acc.connected && <div className="text-xs text-gray-400 font-golos">{acc.username}</div>}
                    </div>
                    <div className="ml-auto">
                      <span className={`text-xs px-2 py-1 rounded-full font-orbitron font-bold ${acc.connected ? 'text-neon-green bg-neon-green/10' : 'text-gray-500 bg-cyber-border'}`}>
                        {acc.connected ? 'ПОДКЛЮЧЁН' : 'НЕ ПРИВЯЗАН'}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs mb-4 font-golos">{acc.desc}</p>
                  {acc.connected ? (
                    <button className="cyber-btn-outline w-full py-2 rounded-md text-xs bg-transparent" style={{ borderColor: '#ff224440', color: '#ff2244' }}>
                      ОТВЯЗАТЬ
                    </button>
                  ) : (
                    <button className="w-full py-2 rounded-md text-xs font-orbitron font-bold transition-all hover:opacity-90"
                      style={{ background: acc.color, color: '#fff' }}>
                      ПРИВЯЗАТЬ {acc.name.toUpperCase()}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="cyber-card rounded-xl p-5">
                <h3 className="font-orbitron text-sm font-bold text-white mb-4">СМЕНА ПАРОЛЯ</h3>
                <div className="space-y-3">
                  {['Текущий пароль', 'Новый пароль', 'Подтверди новый'].map(label => (
                    <div key={label}>
                      <label className="block text-xs font-orbitron text-gray-500 mb-1.5">{label.toUpperCase()}</label>
                      <input type="password" placeholder="••••••••"
                        className="w-full bg-cyber-surface border border-cyber-border rounded-md px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/50 transition-colors font-golos" />
                    </div>
                  ))}
                  <button className="cyber-btn-green w-full py-2.5 rounded-md text-sm">ОБНОВИТЬ ПАРОЛЬ</button>
                </div>
              </div>
              <div className="cyber-card rounded-xl p-5">
                <h3 className="font-orbitron text-sm font-bold text-white mb-4">ДВУХФАКТОРНАЯ ЗАЩИТА</h3>
                <div className="p-3 rounded-lg mb-4" style={{ background: '#12121f' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-golos text-gray-400">2FA через приложение</span>
                    <span className="text-xs text-red-400 font-orbitron">ВЫКЛЮЧЕНО</span>
                  </div>
                </div>
                <button className="cyber-btn-outline w-full py-2.5 rounded-md text-sm bg-transparent">
                  ВКЛЮЧИТЬ 2FA
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
