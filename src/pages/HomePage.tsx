import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { MOCK_SERVERS, GAMES, CHAT_MESSAGES } from '@/data/mockData';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState(CHAT_MESSAGES);
  const [activeGame, setActiveGame] = useState('all');
  const [stats, setStats] = useState({ servers: 0, players: 0, online: 0 });

  useEffect(() => {
    const target = { servers: 2847, players: 148920, online: 12340 };
    const duration = 1500;
    const steps = 60;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setStats({
        servers: Math.round(target.servers * progress),
        players: Math.round(target.players * progress),
        online: Math.round(target.online * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, []);

  const topServers = MOCK_SERVERS.slice(0, 5);
  const top10 = MOCK_SERVERS.slice(0, 10);
  const filteredServers = activeGame === 'all'
    ? MOCK_SERVERS.slice(0, 6)
    : MOCK_SERVERS.filter(s => s.game === activeGame).slice(0, 6);

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      user: 'Гость',
      role: 'user',
      text: chatInput,
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      avatar: 'Г',
    }]);
    setChatInput('');
  };

  const getGameInfo = (gameId: string) => GAMES.find(g => g.id === gameId);

  const getRankMedal = (rank: number) => {
    if (rank === 1) return { icon: '🥇', color: '#ffd700' };
    if (rank === 2) return { icon: '🥈', color: '#c0c0c0' };
    if (rank === 3) return { icon: '🥉', color: '#cd7f32' };
    return { icon: `#${rank}`, color: '#666' };
  };

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden pt-20 pb-16 cyber-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cyber-dark pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-neon-green/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-green/30 bg-neon-green/5 text-neon-green text-sm font-golos mb-6 animate-fade-in">
              <span className="online-dot" />
              <span>LIVE — {stats.players.toLocaleString()} игроков онлайн прямо сейчас</span>
            </div>
            <h1 className="font-orbitron text-5xl md:text-7xl font-black mb-4 animate-fade-in stagger-1" style={{ opacity: 0 }}>
              <span className="text-white">SERVER</span>
              <span className="neon-text-green">ZONE</span>
            </h1>
            <p className="text-gray-400 text-xl font-golos mb-8 animate-fade-in stagger-2" style={{ opacity: 0 }}>
              Мониторинг игровых серверов <span className="text-neon-orange font-semibold">DayZ</span>, Rust, Minecraft, CS2 и других
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in stagger-3" style={{ opacity: 0 }}>
              <button onClick={() => onNavigate('servers')} className="cyber-btn-green px-8 py-4 rounded-md text-lg">
                НАЙТИ СЕРВЕР
              </button>
              <button onClick={() => onNavigate('add-server')} className="cyber-btn-outline px-8 py-4 rounded-md text-lg bg-transparent">
                + ДОБАВИТЬ СЕРВЕР
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-16 animate-fade-in stagger-4" style={{ opacity: 0 }}>
            {[
              { label: 'Серверов', value: stats.servers.toLocaleString() },
              { label: 'Игроков', value: stats.players.toLocaleString() },
              { label: 'Онлайн', value: stats.online.toLocaleString() },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-orbitron text-3xl font-bold neon-text-green">{stat.value}</div>
                <div className="text-gray-500 text-sm mt-1 font-golos">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: TOP-5 + Servers */}
          <div className="lg:col-span-2 space-y-8">

            {/* TOP-5 */}
            <div className="animate-fade-in stagger-1" style={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-orbitron text-xl font-bold text-white flex items-center gap-2">
                  <span className="neon-text-orange">ТОП-5</span> СЕРВЕРОВ НЕДЕЛИ
                </h2>
                <button onClick={() => onNavigate('servers')} className="text-neon-green text-sm hover:underline font-golos">
                  Смотреть все →
                </button>
              </div>
              <div className="space-y-3">
                {topServers.map((server) => {
                  const medal = getRankMedal(server.rank);
                  const game = getGameInfo(server.game);
                  const fillPct = Math.round((server.players / server.maxPlayers) * 100);
                  return (
                    <div key={server.id} className="cyber-card rounded-lg p-4 flex items-center gap-4 cursor-pointer group"
                      onClick={() => onNavigate('servers')}>
                      <div className="font-orbitron text-lg font-black w-8 text-center" style={{ color: medal.color }}>
                        {server.rank <= 3 ? medal.icon : `#${server.rank}`}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {server.isBoosted && (
                            <span className="text-xs px-1.5 py-0.5 rounded font-orbitron font-bold" style={{ background: '#ff6b3520', color: '#ff6b35', border: '1px solid #ff6b3540' }}>BOOST</span>
                          )}
                          {server.isPremium && (
                            <span className="text-xs px-1.5 py-0.5 rounded font-orbitron font-bold" style={{ background: '#00ff8820', color: '#00ff88', border: '1px solid #00ff8840' }}>PRO</span>
                          )}
                          <span className="text-white font-semibold truncate group-hover:text-neon-green transition-colors">{server.name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{game?.icon} {game?.name}</span>
                          <span>• {server.map}</span>
                          <span>• ★ {server.rating}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="online-dot shrink-0" />
                          <span className="font-orbitron text-sm font-bold text-white">{server.players}<span className="text-gray-500">/{server.maxPlayers}</span></span>
                        </div>
                        <div className="w-24 h-1.5 bg-cyber-border rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{
                            width: `${fillPct}%`,
                            background: fillPct > 80 ? '#ff6b35' : fillPct > 50 ? '#f0a500' : '#00ff88'
                          }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Game Filter + Servers Grid */}
            <div className="animate-fade-in stagger-2" style={{ opacity: 0 }}>
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <button
                  onClick={() => setActiveGame('all')}
                  className={`px-3 py-1.5 rounded-md text-sm font-orbitron font-semibold transition-all ${activeGame === 'all' ? 'bg-neon-green text-cyber-dark' : 'border border-cyber-border text-gray-400 hover:border-neon-green/50 hover:text-white'}`}>
                  ВСЕ
                </button>
                {GAMES.map(game => (
                  <button
                    key={game.id}
                    onClick={() => setActiveGame(game.id)}
                    className={`px-3 py-1.5 rounded-md text-sm font-golos transition-all ${activeGame === game.id ? 'text-cyber-dark font-bold' : 'border border-cyber-border text-gray-400 hover:text-white'}`}
                    style={activeGame === game.id ? { background: game.color } : {}}>
                    {game.icon} {game.name.split(' ')[0]}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredServers.map((server, i) => {
                  const game = getGameInfo(server.game);
                  const fillPct = Math.round((server.players / server.maxPlayers) * 100);
                  return (
                    <div key={server.id}
                      className="cyber-card rounded-xl overflow-hidden cursor-pointer group animate-fade-in"
                      style={{ opacity: 0, animationDelay: `${i * 0.06}s` }}
                      onClick={() => onNavigate('servers')}>
                      <div className="relative h-28 overflow-hidden">
                        <img src={server.image} alt={server.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-cyber-card via-transparent to-transparent" />
                        <div className="absolute top-2 left-2 flex gap-1">
                          {server.isBoosted && <span className="text-xs px-1.5 py-0.5 rounded font-orbitron font-bold" style={{ background: '#ff6b35', color: '#fff' }}>BOOST</span>}
                          {server.isPremium && <span className="text-xs px-1.5 py-0.5 rounded font-orbitron font-bold" style={{ background: '#00ff88', color: '#0a0a0f' }}>PRO</span>}
                        </div>
                        <div className="absolute top-2 right-2">
                          <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${server.isOnline ? 'bg-neon-green/20 text-neon-green' : 'bg-red-900/40 text-red-400'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${server.isOnline ? 'bg-neon-green' : 'bg-red-400'}`} />
                            {server.isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                        <div className="absolute bottom-2 right-2 text-xs font-orbitron font-bold" style={{ color: game?.color }}>
                          {game?.icon} {game?.name}
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="font-semibold text-white mb-1 truncate group-hover:text-neon-green transition-colors text-sm">{server.name}</div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs text-gray-500">{server.map}</div>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Icon name="Star" size={10} className="text-yellow-400" />
                            <span>{server.rating}</span>
                            <span className="text-gray-600">({server.votes})</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-cyber-border rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{
                              width: `${fillPct}%`,
                              background: fillPct > 80 ? '#ff6b35' : fillPct > 50 ? '#f0a500' : '#00ff88'
                            }} />
                          </div>
                          <span className="text-xs font-orbitron text-white shrink-0">{server.players}/{server.maxPlayers}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TOP-10 Table */}
            <div className="animate-fade-in stagger-3" style={{ opacity: 0 }}>
              <h2 className="font-orbitron text-xl font-bold text-white mb-4">
                <span className="neon-text-green">ТОП-10</span> РЕЙТИНГ
              </h2>
              <div className="cyber-card rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cyber-border">
                      <th className="text-left p-3 text-xs font-orbitron text-gray-500">#</th>
                      <th className="text-left p-3 text-xs font-orbitron text-gray-500">СЕРВЕР</th>
                      <th className="text-left p-3 text-xs font-orbitron text-gray-500 hidden md:table-cell">ИГРА</th>
                      <th className="text-right p-3 text-xs font-orbitron text-gray-500">ИГРОКИ</th>
                      <th className="text-right p-3 text-xs font-orbitron text-gray-500 hidden sm:table-cell">ПИНГ</th>
                      <th className="text-right p-3 text-xs font-orbitron text-gray-500">РЕЙТИНГ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {top10.map((server, i) => {
                      const game = getGameInfo(server.game);
                      return (
                        <tr key={server.id}
                          className="border-b border-cyber-border/50 hover:bg-neon-green/5 cursor-pointer transition-colors"
                          onClick={() => onNavigate('servers')}>
                          <td className="p-3">
                            <span className="font-orbitron font-bold text-sm" style={{
                              color: i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : '#666'
                            }}>
                              {i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${i + 1}`}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {server.isBoosted && <span className="text-xs px-1 py-0.5 rounded font-orbitron font-bold hidden sm:inline" style={{ background: '#ff6b3520', color: '#ff6b35', border: '1px solid #ff6b3540' }}>B</span>}
                              <span className="text-white text-sm truncate max-w-[140px] md:max-w-[200px]">{server.name}</span>
                            </div>
                          </td>
                          <td className="p-3 hidden md:table-cell">
                            <span className="text-xs text-gray-400">{game?.icon} {game?.name}</span>
                          </td>
                          <td className="p-3 text-right">
                            <span className={`font-orbitron text-sm font-bold ${server.isOnline ? 'text-neon-green' : 'text-red-400'}`}>
                              {server.isOnline ? server.players : '—'}
                            </span>
                            <span className="text-gray-600 text-xs">/{server.maxPlayers}</span>
                          </td>
                          <td className="p-3 text-right hidden sm:table-cell">
                            <span className={`text-sm font-orbitron ${server.ping < 20 ? 'text-neon-green' : server.ping < 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {server.ping}ms
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Icon name="Star" size={12} className="text-yellow-400" />
                              <span className="text-sm text-white">{server.rating}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT: Chat + Top-5 mini */}
          <div className="space-y-6">

            {/* Global Chat */}
            <div className="cyber-card rounded-xl overflow-hidden animate-fade-in stagger-2" style={{ opacity: 0 }}>
              <div className="flex items-center gap-2 p-4 border-b border-cyber-border">
                <Icon name="MessageSquare" size={16} className="text-neon-green" />
                <h3 className="font-orbitron text-sm font-bold text-white">ОБЩИЙ ЧАТ</h3>
                <span className="ml-auto flex items-center gap-1 text-xs text-neon-green">
                  <span className="online-dot" />
                  <span>142 онлайн</span>
                </span>
              </div>
              <div className="h-80 overflow-y-auto p-3 space-y-3 flex flex-col">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex gap-2 group">
                    <div className="w-7 h-7 rounded-md shrink-0 flex items-center justify-center text-xs font-orbitron font-bold"
                      style={{
                        background: msg.role === 'admin' ? '#ff6b3520' : msg.role === 'premium' ? '#00ff8820' : '#1a1a2e',
                        color: msg.role === 'admin' ? '#ff6b35' : msg.role === 'premium' ? '#00ff88' : '#666',
                        border: `1px solid ${msg.role === 'admin' ? '#ff6b3540' : msg.role === 'premium' ? '#00ff8840' : '#1a1a2e'}`
                      }}>
                      {msg.avatar.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold truncate" style={{
                          color: msg.role === 'admin' ? '#ff6b35' : msg.role === 'premium' ? '#00ff88' : '#aaa'
                        }}>
                          {msg.user}
                        </span>
                        {msg.role === 'admin' && <span className="text-xs px-1 rounded text-xs font-orbitron" style={{ background: '#ff6b3520', color: '#ff6b35' }}>ADM</span>}
                        {msg.role === 'premium' && <span className="text-xs px-1 rounded text-xs font-orbitron" style={{ background: '#00ff8820', color: '#00ff88' }}>PRO</span>}
                        <span className="text-gray-600 text-xs ml-auto">{msg.time}</span>
                      </div>
                      <p className="text-gray-300 text-xs mt-0.5 break-words">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-cyber-border">
                <div className="flex gap-2">
                  <input
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Написать в чат..."
                    className="flex-1 bg-cyber-surface border border-cyber-border rounded-md px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/50 transition-colors font-golos"
                  />
                  <button onClick={sendMessage} className="cyber-btn-green px-3 py-2 rounded-md">
                    <Icon name="Send" size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Top-5 DayZ */}
            <div className="cyber-card rounded-xl p-4 animate-fade-in stagger-3" style={{ opacity: 0 }}>
              <h3 className="font-orbitron text-sm font-bold mb-3 flex items-center gap-2">
                <span className="neon-text-orange">🧟</span>
                <span className="text-white">ТОП DayZ</span>
              </h3>
              <div className="space-y-2">
                {MOCK_SERVERS.filter(s => s.game === 'dayz').slice(0, 5).map((server, i) => (
                  <div key={server.id} className="flex items-center gap-2 cursor-pointer hover:text-neon-green transition-colors group" onClick={() => onNavigate('servers')}>
                    <span className="font-orbitron text-xs w-4 text-gray-500">#{i + 1}</span>
                    <span className="flex-1 text-xs text-gray-300 truncate group-hover:text-neon-green transition-colors">{server.name}</span>
                    <span className="text-xs font-orbitron text-neon-green">{server.players}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Add server CTA */}
            <div className="rounded-xl p-4 border border-neon-orange/30 bg-neon-orange/5 animate-fade-in stagger-4" style={{ opacity: 0 }}>
              <h3 className="font-orbitron text-sm font-bold text-neon-orange mb-2">ДОБАВЬ СВОЙ СЕРВЕР</h3>
              <p className="text-gray-400 text-xs mb-3 font-golos">Тысячи игроков ищут серверы прямо сейчас. Займи своё место в рейтинге.</p>
              <button onClick={() => onNavigate('add-server')} className="cyber-btn-outline w-full py-2 rounded-md text-sm bg-transparent" style={{ borderColor: '#ff6b3560', color: '#ff6b35' }}>
                + ДОБАВИТЬ БЕСПЛАТНО
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
