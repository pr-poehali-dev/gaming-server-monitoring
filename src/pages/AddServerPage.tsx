import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { GAMES } from '@/data/mockData';

interface AddServerPageProps {
  onNavigate: (page: string) => void;
}

const STEPS = ['Игра', 'Основное', 'Детали', 'Медиа', 'Готово'];

export default function AddServerPage({ onNavigate }: AddServerPageProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    game: '',
    name: '',
    ip: '',
    port: '',
    map: '',
    maxPlayers: '',
    version: '',
    description: '',
    tags: [] as string[],
    discord: '',
    website: '',
    country: 'RU',
    isModded: false,
    isPvP: false,
    isRP: false,
    tagInput: '',
  });

  const update = (key: string, value: string | boolean | string[]) => setForm(prev => ({ ...prev, [key]: value }));

  const addTag = () => {
    if (form.tagInput.trim() && form.tags.length < 8) {
      update('tags', [...form.tags, form.tagInput.trim()]);
      update('tagInput', '');
    }
  };

  const removeTag = (tag: string) => update('tags', form.tags.filter(t => t !== tag));

  if (step === 4) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-scale-in" style={{ opacity: 0 }}>
          <div className="text-7xl mb-6">🚀</div>
          <h2 className="font-orbitron text-3xl font-black neon-text-green mb-3">СЕРВЕР ДОБАВЛЕН!</h2>
          <p className="text-gray-400 font-golos mb-8">Сервер отправлен на проверку и появится в списке в течение нескольких минут.</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => onNavigate('servers')} className="cyber-btn-green px-6 py-3 rounded-md text-sm">ПРОСМОТР СЕРВЕРОВ</button>
            <button onClick={() => onNavigate('shop')} className="cyber-btn-outline px-6 py-3 rounded-md text-sm bg-transparent">🚀 ЗАБУСТИТЬ</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <h1 className="font-orbitron text-3xl font-black text-white mb-2">
            ДОБАВИТЬ <span className="neon-text-green">СЕРВЕР</span>
          </h1>
          <p className="text-gray-500 font-golos">Заполни информацию о своём сервере</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-1 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-orbitron font-bold transition-all ${i < step ? 'bg-neon-green text-cyber-dark' : i === step ? 'border-2 border-neon-green text-neon-green' : 'border border-cyber-border text-gray-600'}`}>
                {i < step ? <Icon name="Check" size={14} /> : i + 1}
              </div>
              <div className="flex-1 text-xs text-center font-golos hidden sm:block" style={{ color: i === step ? '#00ff88' : '#555' }}>{s}</div>
              {i < STEPS.length - 1 && <div className="w-4 h-px mx-1" style={{ background: i < step ? '#00ff88' : '#1a1a2e' }} />}
            </div>
          ))}
        </div>

        <div className="cyber-card rounded-xl p-6 animate-fade-in" style={{ opacity: 0 }}>
          {/* Step 0: Choose Game */}
          {step === 0 && (
            <div>
              <h2 className="font-orbitron text-lg font-bold text-white mb-5">ВЫБЕРИ ИГРУ</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {GAMES.map(game => (
                  <button
                    key={game.id}
                    onClick={() => update('game', game.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${form.game === game.id ? 'neon-border-green bg-neon-green/5' : 'border-cyber-border hover:border-cyber-border/80'}`}
                    style={form.game === game.id ? { borderColor: game.color, background: `${game.bg}` } : {}}>
                    <div className="text-3xl mb-2">{game.icon}</div>
                    <div className="font-orbitron text-sm font-bold" style={{ color: form.game === game.id ? game.color : '#aaa' }}>{game.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div>
              <h2 className="font-orbitron text-lg font-bold text-white mb-5">ОСНОВНАЯ ИНФОРМАЦИЯ</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-orbitron text-gray-500 mb-1.5">НАЗВАНИЕ СЕРВЕРА *</label>
                  <input value={form.name} onChange={e => update('name', e.target.value)}
                    placeholder="Мой крутой сервер"
                    className="w-full bg-cyber-surface border border-cyber-border rounded-md px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/50 font-golos" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-orbitron text-gray-500 mb-1.5">IP АДРЕС *</label>
                    <input value={form.ip} onChange={e => update('ip', e.target.value)}
                      placeholder="185.244.120.1"
                      className="w-full bg-cyber-surface border border-cyber-border rounded-md px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/50 font-golos" />
                  </div>
                  <div>
                    <label className="block text-xs font-orbitron text-gray-500 mb-1.5">ПОРТ *</label>
                    <input value={form.port} onChange={e => update('port', e.target.value)}
                      placeholder="2302"
                      className="w-full bg-cyber-surface border border-cyber-border rounded-md px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/50 font-golos" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-orbitron text-gray-500 mb-1.5">КАРТА</label>
                    <input value={form.map} onChange={e => update('map', e.target.value)}
                      placeholder="Chernarus"
                      className="w-full bg-cyber-surface border border-cyber-border rounded-md px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/50 font-golos" />
                  </div>
                  <div>
                    <label className="block text-xs font-orbitron text-gray-500 mb-1.5">МАКС. ИГРОКОВ</label>
                    <input value={form.maxPlayers} onChange={e => update('maxPlayers', e.target.value)}
                      placeholder="60"
                      className="w-full bg-cyber-surface border border-cyber-border rounded-md px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/50 font-golos" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-orbitron text-gray-500 mb-1.5">ВЕРСИЯ ИГРЫ</label>
                  <input value={form.version} onChange={e => update('version', e.target.value)}
                    placeholder="1.24"
                    className="w-full bg-cyber-surface border border-cyber-border rounded-md px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/50 font-golos" />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div>
              <h2 className="font-orbitron text-lg font-bold text-white mb-5">ОПИСАНИЕ И ТЕГИ</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-orbitron text-gray-500 mb-1.5">ОПИСАНИЕ СЕРВЕРА</label>
                  <textarea value={form.description} onChange={e => update('description', e.target.value)}
                    rows={4} placeholder="Расскажи о своём сервере: особенности геймплея, правила, уникальные механики..."
                    className="w-full bg-cyber-surface border border-cyber-border rounded-md px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/50 font-golos resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-orbitron text-gray-500 mb-1.5">ТЕГИ ({form.tags.length}/8)</label>
                  <div className="flex gap-2 mb-2">
                    <input value={form.tagInput} onChange={e => update('tagInput', e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addTag()}
                      placeholder="PvP, Modded, Economy..."
                      className="flex-1 bg-cyber-surface border border-cyber-border rounded-md px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/50 font-golos" />
                    <button onClick={addTag} className="cyber-btn-green px-4 py-2 rounded-md text-xs">+</button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {form.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-golos cursor-pointer hover:bg-red-900/20"
                        style={{ background: '#1a1a2e', color: '#aaa', border: '1px solid #2a2a3e' }}
                        onClick={() => removeTag(tag)}>
                        {tag} <Icon name="X" size={10} />
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-orbitron text-gray-500 mb-1.5">DISCORD</label>
                    <input value={form.discord} onChange={e => update('discord', e.target.value)}
                      placeholder="discord.gg/myserver"
                      className="w-full bg-cyber-surface border border-cyber-border rounded-md px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/50 font-golos" />
                  </div>
                  <div>
                    <label className="block text-xs font-orbitron text-gray-500 mb-1.5">САЙТ</label>
                    <input value={form.website} onChange={e => update('website', e.target.value)}
                      placeholder="https://myserver.ru"
                      className="w-full bg-cyber-surface border border-cyber-border rounded-md px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/50 font-golos" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-orbitron text-gray-500 mb-2">ХАРАКТЕРИСТИКИ</label>
                  <div className="flex gap-3 flex-wrap">
                    {[
                      { key: 'isModded', label: 'MODDED' },
                      { key: 'isPvP', label: 'PVP' },
                      { key: 'isRP', label: 'ROLEPLAY' },
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => update(opt.key, !form[opt.key as keyof typeof form])}
                        className={`px-4 py-2 rounded-md text-xs font-orbitron font-bold transition-all ${form[opt.key as keyof typeof form] ? 'bg-neon-green text-cyber-dark' : 'border border-cyber-border text-gray-500 hover:border-neon-green/30'}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Media */}
          {step === 3 && (
            <div>
              <h2 className="font-orbitron text-lg font-bold text-white mb-5">ФОТО СЕРВЕРА</h2>
              <div className="border-2 border-dashed border-cyber-border rounded-xl p-10 text-center hover:border-neon-green/30 transition-colors cursor-pointer mb-4">
                <Icon name="Upload" size={40} className="mx-auto mb-3 text-gray-600" />
                <p className="text-gray-400 font-golos mb-1">Перетащи изображение или нажми для загрузки</p>
                <p className="text-xs text-gray-600 font-golos">PNG, JPG до 5MB. Рекомендуем 1280×720</p>
              </div>
              <div className="p-4 rounded-lg" style={{ background: '#12121f', border: '1px solid #1a1a2e' }}>
                <p className="text-xs text-gray-500 font-golos">💡 <strong className="text-gray-400">Совет:</strong> Сервера с качественными скриншотами получают на 3x больше кликов. Загрузи красивый скриншот из игры.</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6 pt-5 border-t border-cyber-border">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              className="cyber-btn-outline px-5 py-2.5 rounded-md text-sm bg-transparent"
              style={{ visibility: step === 0 ? 'hidden' : 'visible' }}>
              <Icon name="ArrowLeft" size={14} className="inline mr-1" /> НАЗАД
            </button>
            <button
              onClick={() => {
                if (step < STEPS.length - 2) setStep(step + 1);
                else setStep(4);
              }}
              disabled={step === 0 && !form.game}
              className="cyber-btn-green px-6 py-2.5 rounded-md text-sm disabled:opacity-40 disabled:cursor-not-allowed">
              {step === 3 ? 'ОПУБЛИКОВАТЬ' : 'ДАЛЕЕ'} <Icon name="ArrowRight" size={14} className="inline ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
