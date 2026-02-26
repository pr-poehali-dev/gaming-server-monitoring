import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { BOOSTS, SUBSCRIPTIONS } from '@/data/mockData';

interface ShopPageProps {
  onNavigate: (page: string) => void;
}

const TABS = [
  { id: 'subscriptions', label: 'Подписки', icon: 'Crown' },
  { id: 'boosts', label: 'Бусты серверов', icon: 'Zap' },
  { id: 'ads', label: 'Реклама', icon: 'Megaphone' },
];

export default function ShopPage({ onNavigate }: ShopPageProps) {
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="font-orbitron text-4xl font-black text-white mb-3">
            МАГАЗИН <span className="neon-text-orange">БУСТ</span>
          </h1>
          <p className="text-gray-500 font-golos">Продвигай свои серверы и привлекай тысячи игроков</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 justify-center">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-orbitron transition-all ${activeTab === tab.id ? 'bg-neon-orange text-white' : 'border border-cyber-border text-gray-400 hover:border-neon-orange/30 hover:text-white'}`}>
              <Icon name={tab.icon} size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Subscriptions */}
        {activeTab === 'subscriptions' && (
          <div className="animate-fade-in" style={{ opacity: 0 }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {SUBSCRIPTIONS.map((sub) => (
                <div
                  key={sub.id}
                  className={`cyber-card rounded-xl p-6 relative cursor-pointer transition-all ${selectedPlan === sub.id ? 'ring-2' : ''} ${sub.popular ? 'scale-105' : ''}`}
                  style={{
                    ringColor: sub.color,
                    borderColor: selectedPlan === sub.id ? sub.color : undefined,
                    boxShadow: selectedPlan === sub.id ? `0 0 20px ${sub.color}30` : undefined,
                  }}
                  onClick={() => setSelectedPlan(sub.id)}>
                  {sub.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-orbitron font-black"
                      style={{ background: sub.color, color: '#0a0a0f' }}>
                      ПОПУЛЯРНОЕ
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <div className="font-orbitron text-xl font-black mb-1" style={{ color: sub.color }}>{sub.name}</div>
                    <div className="font-orbitron text-4xl font-black text-white mt-2">
                      {sub.price === 0 ? 'FREE' : `${sub.price}₽`}
                    </div>
                    {sub.price > 0 && <div className="text-xs text-gray-500 font-golos">в месяц</div>}
                  </div>
                  <div className="space-y-2 mb-6">
                    {sub.features.map(f => (
                      <div key={f} className="flex items-center gap-2 text-sm font-golos text-gray-300">
                        <Icon name="Check" size={14} style={{ color: sub.color, flexShrink: 0 }} />
                        {f}
                      </div>
                    ))}
                  </div>
                  <button
                    className={`w-full py-3 rounded-md text-sm font-orbitron font-bold transition-all ${sub.price === 0 ? 'border border-cyber-border text-gray-500 cursor-default' : ''}`}
                    style={sub.price > 0 ? {
                      background: sub.color,
                      color: sub.color === '#ff6b35' ? '#fff' : '#0a0a0f',
                    } : {}}
                    disabled={sub.price === 0}>
                    {sub.price === 0 ? 'ТЕКУЩИЙ ПЛАН' : 'ВЫБРАТЬ'}
                  </button>
                </div>
              ))}
            </div>

            <div className="text-center mt-8 text-xs text-gray-600 font-golos">
              Оплата через ЮKassa, QIWI, Сбер Pay. При отмене — возврат за неиспользованный период.
            </div>
          </div>
        )}

        {/* Boosts */}
        {activeTab === 'boosts' && (
          <div className="animate-fade-in" style={{ opacity: 0 }}>
            <p className="text-center text-gray-500 font-golos mb-8">Бусты поднимают твой сервер в топ выдачи и добавляют визуальные украшения</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {BOOSTS.map(boost => (
                <div
                  key={boost.id}
                  className={`cyber-card rounded-xl p-6 relative cursor-pointer transition-all ${selectedPlan === boost.id ? 'ring-2' : ''} ${boost.popular ? 'scale-105' : ''}`}
                  style={{
                    borderColor: selectedPlan === boost.id ? boost.color : undefined,
                    boxShadow: selectedPlan === boost.id ? `0 0 20px ${boost.color}30` : boost.popular ? `0 0 30px ${boost.color}20` : undefined,
                  }}
                  onClick={() => setSelectedPlan(boost.id)}>
                  {boost.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-orbitron font-black text-cyber-dark"
                      style={{ background: boost.color }}>
                      ХИТРЫЙ ВЫБОР
                    </div>
                  )}
                  <div className="text-center mb-5">
                    <div className="font-orbitron font-black text-4xl mb-1" style={{ color: boost.color }}>🚀</div>
                    <div className="font-orbitron text-lg font-bold text-white">{boost.name}</div>
                    <div className="font-orbitron text-3xl font-black text-white mt-2">900</div>
                    <div className="text-xs font-golos mt-1" style={{ color: boost.color }}>{boost.duration}</div>
                  </div>
                  <div className="space-y-2 mb-5">
                    {boost.features.map(f => (
                      <div key={f} className="flex items-center gap-2 text-sm font-golos text-gray-300">
                        <Icon name="Zap" size={12} style={{ color: boost.color, flexShrink: 0 }} />
                        {f}
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-3 rounded-md text-sm font-orbitron font-bold transition-all hover:opacity-90"
                    style={{ background: boost.color, color: '#fff' }}>
                    КУПИТЬ БУСТ
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ads */}
        {activeTab === 'ads' && (
          <div className="animate-fade-in max-w-3xl mx-auto" style={{ opacity: 0 }}>
            <div className="space-y-4 mb-8">
              {[
                {
                  name: 'Баннер на главной',
                  size: '728×90 px',
                  price: '1,990₽ / неделя',
                  desc: 'Показывается на главной странице всем посетителям. ~50,000 показов в неделю.',
                  icon: '📢',
                  color: '#00d4ff',
                },
                {
                  name: 'Топ-1 в рейтинге',
                  size: 'Фиксированная позиция',
                  price: '2,990₽ / неделя',
                  desc: 'Твой сервер всегда на первом месте в своей категории игр.',
                  icon: '🏆',
                  color: '#ffd700',
                },
                {
                  name: 'Discord рассылка',
                  size: 'Embed в каналах',
                  price: '990₽ / рассылка',
                  desc: 'Красивый embed с информацией о сервере в нашем Discord 15,000+ участников.',
                  icon: '📨',
                  color: '#5865f2',
                },
                {
                  name: 'Спонсор раздела',
                  size: 'Логотип + баннер',
                  price: '4,990₽ / месяц',
                  desc: 'Твой логотип в разделе конкретной игры. Эксклюзивное размещение.',
                  icon: '⭐',
                  color: '#ff6b35',
                },
              ].map(ad => (
                <div key={ad.name} className="cyber-card rounded-xl p-5 flex items-start gap-4 hover:border-neon-blue/30 transition-all cursor-pointer">
                  <div className="text-3xl shrink-0">{ad.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-orbitron font-bold text-white mb-0.5">{ad.name}</div>
                        <div className="text-xs text-gray-500 font-golos mb-2">{ad.size}</div>
                        <p className="text-sm text-gray-400 font-golos">{ad.desc}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-orbitron font-black text-lg" style={{ color: ad.color }}>{ad.price}</div>
                        <button className="mt-2 px-4 py-1.5 rounded-md text-xs font-orbitron font-bold"
                          style={{ background: `${ad.color}20`, color: ad.color, border: `1px solid ${ad.color}40` }}>
                          ЗАКАЗАТЬ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center cyber-card rounded-xl p-6">
              <h3 className="font-orbitron text-lg font-bold text-white mb-2">Нужно индивидуальное решение?</h3>
              <p className="text-gray-400 font-golos text-sm mb-4">Свяжись с нами для обсуждения специальных условий размещения</p>
              <button onClick={() => onNavigate('contacts')} className="cyber-btn-outline px-6 py-2.5 rounded-md text-sm bg-transparent">
                СВЯЗАТЬСЯ С НАМИ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}