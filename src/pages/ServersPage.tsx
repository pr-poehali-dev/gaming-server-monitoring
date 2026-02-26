import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { MOCK_SERVERS, GAMES } from '@/data/mockData';

interface ServersPageProps {
  onNavigate: (page: string) => void;
}

export default function ServersPage({ onNavigate }: ServersPageProps) {
  const [search, setSearch] = useState('');
  const [activeGame, setActiveGame] = useState('all');
  const [sortBy, setSortBy] = useState('rank');
  const [filterOnline, setFilterOnline] = useState(false);
  const [filterPremium, setFilterPremium] = useState(false);
  const [selectedServer, setSelectedServer] = useState<typeof MOCK_SERVERS[0] | null>(null);

  const getGameInfo = (id: string) => GAMES.find(g => g.id === id);

  const filtered = MOCK_SERVERS
    .filter(s => {
      if (activeGame !== 'all' && s.game !== activeGame) return false;
      if (filterOnline && !s.isOnline) return false;
      if (filterPremium && !s.isPremium) return false;
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.map.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'players') return b.players - a.players;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'ping') return a.ping - b.ping;
      if (sortBy === 'votes') return b.votes - a.votes;
      return a.rank - b.rank;
    });

  return (
    <div className="min-h-screen pt-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-orbitron text-3xl font-black text-white mb-2">
            МОНИТОРИНГ <span className="neon-text-green">СЕРВЕРОВ</span>
          </h1>
          <p className="text-gray-500 font-golos">Найдено {filtered.length} серверов</p>
        </div>

        {/* Filters */}
        <div className="cyber-card rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Поиск по названию, карте..."
                className="w-full bg-cyber-surface border border-cyber-border rounded-md pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/50 transition-colors font-golos"
              />
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-cyber-surface border border-cyber-border rounded-md px-3 py-2.5 text-sm text-white font-orbitron focus:outline-none focus:border-neon-green/50 cursor-pointer"
            >
              <option value="rank">По рейтингу</option>
              <option value="players">По игрокам</option>
              <option value="rating">По оценке</option>
              <option value="ping">По пингу</option>
              <option value="votes">По голосам</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterOnline(!filterOnline)}
                className={`px-4 py-2.5 rounded-md text-sm font-orbitron transition-all ${filterOnline ? 'bg-neon-green text-cyber-dark' : 'border border-cyber-border text-gray-400 hover:border-neon-green/50'}`}>
                ОНЛАЙН
              </button>
              <button
                onClick={() => setFilterPremium(!filterPremium)}
                className={`px-4 py-2.5 rounded-md text-sm font-orbitron transition-all ${filterPremium ? 'bg-neon-orange text-white' : 'border border-cyber-border text-gray-400 hover:border-neon-orange/50'}`}>
                PRO
              </button>
            </div>
          </div>

          <div className="flex gap-2 mt-3 flex-wrap">
            <button
              onClick={() => setActiveGame('all')}
              className={`px-3 py-1.5 rounded-md text-sm font-orbitron transition-all ${activeGame === 'all' ? 'bg-neon-green text-cyber-dark font-bold' : 'border border-cyber-border text-gray-400 hover:border-neon-green/30'}`}>
              ВСЕ ИГРЫ
            </button>
            {GAMES.map(game => (
              <button
                key={game.id}
                onClick={() => setActiveGame(game.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-golos transition-all ${activeGame === game.id ? 'font-bold text-cyber-dark' : 'border border-cyber-border text-gray-400 hover:text-white'}`}
                style={activeGame === game.id ? { background: game.color } : {}}>
                {game.icon} {game.name}
              </button>
            ))}
          </div>
        </div>

        {/* Server List */}
        {selectedServer ? (
          <ServerDetail server={selectedServer} onBack={() => setSelectedServer(null)} onNavigate={onNavigate} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((server, i) => {
              const game = getGameInfo(server.game);
              const fillPct = Math.round((server.players / server.maxPlayers) * 100);
              return (
                <div
                  key={server.id}
                  className="cyber-card rounded-xl overflow-hidden cursor-pointer group animate-fade-in"
                  style={{ opacity: 0, animationDelay: `${i * 0.04}s` }}
                  onClick={() => setSelectedServer(server)}
                >
                  <div className="relative h-36 overflow-hidden">
                    <img src={server.image} alt={server.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-cyber-card via-transparent to-transparent" />
                    <div className="absolute top-2 left-2 flex gap-1">
                      {server.isBoosted && <span className="text-xs px-1.5 py-0.5 rounded font-orbitron font-bold" style={{ background: '#ff6b35', color: '#fff' }}>BOOST</span>}
                      {server.isPremium && <span className="text-xs px-1.5 py-0.5 rounded font-orbitron font-bold" style={{ background: '#00ff88', color: '#0a0a0f' }}>PRO</span>}
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${server.isOnline ? 'bg-neon-green/20 text-neon-green' : 'bg-red-900/40 text-red-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${server.isOnline ? 'bg-neon-green animate-pulse' : 'bg-red-400'}`} />
                        {server.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
                      <span className="text-xs font-orbitron font-bold" style={{ color: game?.color }}>{game?.icon} {game?.name}</span>
                      <span className="font-orbitron font-black text-sm" style={{ color: server.rank <= 3 ? ['#ffd700', '#c0c0c0', '#cd7f32'][server.rank - 1] : '#555' }}>
                        #{server.rank}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-1 truncate group-hover:text-neon-green transition-colors">{server.name}</h3>
                    <p className="text-gray-500 text-xs mb-3 line-clamp-2 font-golos">{server.description}</p>
                    <div className="flex gap-1 mb-3 flex-wrap">
                      {server.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs px-1.5 py-0.5 rounded font-golos" style={{ background: '#1a1a2e', color: '#666', border: '1px solid #1a1a2e' }}>{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Icon name="Map" size={10} /> {server.map}</span>
                        <span className="flex items-center gap-1"><Icon name="Wifi" size={10} style={{ color: server.ping < 20 ? '#00ff88' : server.ping < 50 ? '#f0a500' : '#ff2244' }} /> {server.ping}ms</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Icon name="Star" size={10} className="text-yellow-400" />
                        <span className="text-white font-semibold">{server.rating}</span>
                        <span className="text-gray-600">({server.votes})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-cyber-border rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{
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
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-orbitron text-xl text-gray-400 mb-2">Серверы не найдены</h3>
            <p className="text-gray-600 font-golos">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ServerDetail({ server, onBack, onNavigate }: { server: typeof MOCK_SERVERS[0]; onBack: () => void; onNavigate: (p: string) => void }) {
  const game = GAMES.find(g => g.id === server.game);
  const fillPct = Math.round((server.players / server.maxPlayers) * 100);
  const maxHistory = Math.max(...server.history);

  return (
    <div className="animate-fade-in" style={{ opacity: 0 }}>
      <button onClick={onBack} className="flex items-center gap-2 text-neon-green hover:underline mb-6 font-golos text-sm">
        <Icon name="ArrowLeft" size={16} /> Назад к списку
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="cyber-card rounded-xl overflow-hidden">
            <div className="relative h-56">
              <img src={server.image} alt={server.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-cyber-card to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 mb-2">
                  {server.isBoosted && <span className="text-xs px-2 py-0.5 rounded font-orbitron font-bold" style={{ background: '#ff6b35', color: '#fff' }}>BOOST</span>}
                  {server.isPremium && <span className="text-xs px-2 py-0.5 rounded font-orbitron font-bold" style={{ background: '#00ff88', color: '#0a0a0f' }}>PRO</span>}
                  <span className="text-xs px-2 py-0.5 rounded font-orbitron" style={{ background: '#1a1a2e', color: '#666' }}>#{server.rank}</span>
                </div>
                <h1 className="font-orbitron text-2xl font-black text-white">{server.name}</h1>
              </div>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {[
                  { label: 'Статус', value: server.isOnline ? 'ONLINE' : 'OFFLINE', color: server.isOnline ? '#00ff88' : '#ff2244' },
                  { label: 'Игроки', value: `${server.players}/${server.maxPlayers}`, color: '#fff' },
                  { label: 'Пинг', value: `${server.ping}ms`, color: server.ping < 20 ? '#00ff88' : server.ping < 50 ? '#f0a500' : '#ff2244' },
                  { label: 'Uptime', value: `${server.uptime}%`, color: '#00ff88' },
                ].map(stat => (
                  <div key={stat.label} className="text-center p-3 rounded-lg" style={{ background: '#12121f' }}>
                    <div className="font-orbitron font-bold text-lg" style={{ color: stat.color }}>{stat.value}</div>
                    <div className="text-xs text-gray-500 mt-0.5 font-golos">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500 font-golos">Заполненность</span>
                  <span className="font-orbitron text-white">{fillPct}%</span>
                </div>
                <div className="h-2 bg-cyber-border rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{
                    width: `${fillPct}%`,
                    background: fillPct > 80 ? '#ff6b35' : fillPct > 50 ? '#f0a500' : '#00ff88'
                  }} />
                </div>
              </div>

              <p className="text-gray-400 text-sm font-golos mb-4">{server.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {server.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 rounded text-xs font-golos" style={{ background: '#1a1a2e', color: '#aaa', border: '1px solid #2a2a3e' }}>{tag}</span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { icon: 'Map', label: 'Карта', value: server.map },
                  { icon: 'Code', label: 'Версия', value: server.version },
                  { icon: 'Globe', label: 'Страна', value: server.country },
                  { icon: 'Calendar', label: 'Добавлен', value: `${server.addedDays} дней назад` },
                  { icon: 'Server', label: 'IP', value: server.ip },
                  { icon: 'User', label: 'Владелец', value: server.owner },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <Icon name={item.icon} size={14} className="text-gray-500 shrink-0" />
                    <span className="text-gray-500 font-golos">{item.label}:</span>
                    <span className="text-gray-300 font-golos truncate">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mini chart */}
          <div className="cyber-card rounded-xl p-5">
            <h3 className="font-orbitron text-sm font-bold text-white mb-4">ИСТОРИЯ ОНЛАЙНА (24 ЧАСА)</h3>
            <div className="flex items-end gap-1 h-20">
              {server.history.map((val, i) => (
                <div key={i} className="flex-1 rounded-t transition-all hover:opacity-80 group relative cursor-default"
                  style={{ height: `${(val / maxHistory) * 100}%`, background: `linear-gradient(to top, #00ff88, #00ff8860)` }}>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-orbitron text-neon-green opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {val}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-600 font-golos">
              <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="cyber-card rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1">
                <Icon name="Star" size={16} className="text-yellow-400" />
                <span className="font-orbitron text-2xl font-black text-white">{server.rating}</span>
              </div>
              <span className="text-sm text-gray-500 font-golos">{server.votes} голосов</span>
            </div>
            <button className="cyber-btn-green w-full py-3 rounded-md text-sm mb-2">
              <Icon name="ThumbsUp" size={14} className="inline mr-2" /> ПРОГОЛОСОВАТЬ
            </button>
            <button onClick={() => onNavigate('shop')} className="cyber-btn-outline w-full py-2.5 rounded-md text-xs bg-transparent">
              🚀 ЗАБУСТИТЬ СЕРВЕР
            </button>
          </div>

          {server.discord && (
            <div className="cyber-card rounded-xl p-4">
              <h4 className="font-orbitron text-xs text-gray-500 mb-3">СООБЩЕСТВО</h4>
              <a href={`https://${server.discord}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#5865f220] transition-colors group">
                <div className="w-8 h-8 rounded-md flex items-center justify-center text-white font-bold text-sm" style={{ background: '#5865f2' }}>D</div>
                <div>
                  <div className="text-xs text-gray-400 group-hover:text-white transition-colors font-golos">{server.discord}</div>
                  <div className="text-xs text-gray-600 font-golos">Discord сервер</div>
                </div>
              </a>
            </div>
          )}

          <div className="cyber-card rounded-xl p-4">
            <h4 className="font-orbitron text-xs text-gray-500 mb-3">ИГРА</h4>
            <div className="flex items-center gap-3 p-2 rounded-lg" style={{ background: game?.bg }}>
              <span className="text-2xl">{game?.icon}</span>
              <div>
                <div className="font-orbitron font-bold text-sm" style={{ color: game?.color }}>{game?.name}</div>
                <div className="text-xs text-gray-500 font-golos">v{server.version}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}