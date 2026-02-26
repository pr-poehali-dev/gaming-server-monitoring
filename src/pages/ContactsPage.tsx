import { useState } from 'react';
import Icon from '@/components/ui/icon';

export default function ContactsPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const send = () => {
    if (form.name && form.email && form.message) setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-scale-in" style={{ opacity: 0 }}>
          <div className="text-6xl mb-4">✅</div>
          <h2 className="font-orbitron text-2xl font-black neon-text-green mb-2">СООБЩЕНИЕ ОТПРАВЛЕНО</h2>
          <p className="text-gray-400 font-golos">Ответим в течение 24 часов</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="font-orbitron text-3xl font-black text-white mb-2">ПОДДЕРЖКА И <span className="neon-text-green">КОНТАКТЫ</span></h1>
          <p className="text-gray-500 font-golos">Мы отвечаем в течение 24 часов</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {[
              { icon: 'MessageSquare', title: 'Discord', value: 'discord.gg/serverzone', color: '#5865f2', desc: 'Быстрая помощь в нашем сервере' },
              { icon: 'Mail', title: 'Email', value: 'support@serverzone.ru', color: '#00ff88', desc: 'Для официальных запросов' },
              { icon: 'Send', title: 'Telegram', value: '@serverzone_support', color: '#00d4ff', desc: 'Оперативная поддержка' },
            ].map(item => (
              <div key={item.title} className="cyber-card rounded-xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${item.color}20`, border: `1px solid ${item.color}40` }}>
                  <Icon name={item.icon} size={18} style={{ color: item.color }} />
                </div>
                <div>
                  <div className="font-orbitron font-bold text-white text-sm">{item.title}</div>
                  <div className="font-golos text-sm mt-0.5" style={{ color: item.color }}>{item.value}</div>
                  <div className="text-xs text-gray-500 font-golos mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}

            <div className="cyber-card rounded-xl p-5">
              <h3 className="font-orbitron text-sm font-bold text-white mb-3">FAQ</h3>
              <div className="space-y-3">
                {[
                  { q: 'Как добавить сервер?', a: 'Войди в аккаунт → "Добавить сервер" → заполни форму' },
                  { q: 'Как работают бусты?', a: 'Буст поднимает твой сервер выше в поиске на заданный период' },
                  { q: 'Как привязать Discord?', a: 'Профиль → Аккаунты → "Привязать Discord"' },
                ].map(faq => (
                  <div key={faq.q} className="border-b border-cyber-border/50 pb-3">
                    <div className="text-sm text-neon-green font-golos mb-1">❓ {faq.q}</div>
                    <div className="text-xs text-gray-400 font-golos">{faq.a}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="cyber-card rounded-xl p-6">
            <h2 className="font-orbitron text-lg font-bold text-white mb-5">НАПИСАТЬ НАМ</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-orbitron text-gray-500 mb-1.5">ИМЯ *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Твоё имя"
                    className="w-full bg-cyber-surface border border-cyber-border rounded-md px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/50 font-golos" />
                </div>
                <div>
                  <label className="block text-xs font-orbitron text-gray-500 mb-1.5">EMAIL *</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="email@mail.ru"
                    className="w-full bg-cyber-surface border border-cyber-border rounded-md px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/50 font-golos" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-orbitron text-gray-500 mb-1.5">ТЕМА</label>
                <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="w-full bg-cyber-surface border border-cyber-border rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-neon-green/50 font-golos">
                  <option value="">Выбери тему</option>
                  <option value="server">Вопрос по серверу</option>
                  <option value="payment">Оплата / Возврат</option>
                  <option value="bug">Сообщить об ошибке</option>
                  <option value="ads">Реклама и сотрудничество</option>
                  <option value="other">Другое</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-orbitron text-gray-500 mb-1.5">СООБЩЕНИЕ *</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  rows={5} placeholder="Опиши свой вопрос или проблему..."
                  className="w-full bg-cyber-surface border border-cyber-border rounded-md px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/50 font-golos resize-none" />
              </div>
              <button onClick={send} className="cyber-btn-green w-full py-3 rounded-md text-sm">
                <Icon name="Send" size={14} className="inline mr-2" /> ОТПРАВИТЬ СООБЩЕНИЕ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
