import { useState } from 'react';
import Icon from '@/components/ui/icon';
import HomePage from '@/pages/HomePage';
import ServersPage from '@/pages/ServersPage';
import ProfilePage from '@/pages/ProfilePage';
import ShopPage from '@/pages/ShopPage';
import AdminPage from '@/pages/AdminPage';
import ContactsPage from '@/pages/ContactsPage';
import AddServerPage from '@/pages/AddServerPage';

const NAV_ITEMS = [
  { id: 'home', label: 'Главная', icon: 'Home' },
  { id: 'servers', label: 'Серверы', icon: 'Server' },
  { id: 'shop', label: 'Магазин', icon: 'Zap' },
  { id: 'contacts', label: 'Поддержка', icon: 'HelpCircle' },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (page: string) => {
    setCurrentPage(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage onNavigate={navigate} />;
      case 'servers': return <ServersPage onNavigate={navigate} />;
      case 'profile': return <ProfilePage onNavigate={navigate} />;
      case 'shop': return <ShopPage onNavigate={navigate} />;
      case 'admin': return <AdminPage onNavigate={navigate} />;
      case 'contacts': return <ContactsPage />;
      case 'add-server': return <AddServerPage onNavigate={navigate} />;
      default: return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      {/* Scan line effect */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-neon-green/20 to-transparent animate-scan-line" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-cyber-border"
        style={{ background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(10px)' }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center h-14 gap-6">
            {/* Logo */}
            <button onClick={() => navigate('home')} className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 rounded-md flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #00ff88, #00cc6a)' }}>
                <span className="font-orbitron font-black text-xs text-cyber-dark">SZ</span>
              </div>
              <span className="font-orbitron font-black text-white text-lg hidden sm:block">
                SERVER<span className="neon-text-green">ZONE</span>
              </span>
            </button>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-0.5 flex-1">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm transition-all font-golos ${currentPage === item.id ? 'text-neon-green bg-neon-green/10' : 'text-gray-400 hover:text-white hover:bg-cyber-surface'}`}>
                  <Icon name={item.icon} size={14} />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right */}
            <div className="flex items-center gap-2 ml-auto">
              <button onClick={() => navigate('add-server')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-orbitron font-bold transition-all border border-neon-orange/40 text-neon-orange hover:border-neon-orange hover:bg-neon-orange/10">
                <Icon name="Plus" size={12} /> ДОБАВИТЬ СЕРВЕР
              </button>
              <button onClick={() => navigate('profile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all font-golos ${currentPage === 'profile' ? 'text-neon-green bg-neon-green/10' : 'text-gray-400 hover:text-white'}`}>
                <div className="w-6 h-6 rounded-md flex items-center justify-center font-orbitron font-bold text-xs"
                  style={{ background: 'linear-gradient(135deg, #00ff88, #00cc6a)', color: '#0a0a0f' }}>
                  N
                </div>
                <span className="hidden sm:inline">Профиль</span>
              </button>
              <button onClick={() => navigate('admin')}
                className="px-2 py-1.5 rounded-md text-xs font-orbitron text-gray-600 hover:text-neon-orange transition-colors border border-transparent hover:border-neon-orange/20"
                title="Admin">
                <Icon name="Shield" size={14} />
              </button>

              {/* Mobile menu */}
              <button className="md:hidden p-1.5 text-gray-400 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
                <Icon name={menuOpen ? 'X' : 'Menu'} size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-cyber-border py-2 px-4 animate-fade-in" style={{ opacity: 0 }}>
            {[...NAV_ITEMS, { id: 'profile', label: 'Профиль', icon: 'User' }, { id: 'add-server', label: 'Добавить сервер', icon: 'Plus' }].map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`flex items-center gap-3 w-full px-3 py-3 rounded-md text-sm transition-all font-golos ${currentPage === item.id ? 'text-neon-green bg-neon-green/10' : 'text-gray-400 hover:text-white'}`}>
                <Icon name={item.icon} size={16} />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main */}
      <main className="pt-14">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="border-t border-cyber-border mt-16 py-8" style={{ background: '#050508' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00ff88, #00cc6a)' }}>
                <span className="font-orbitron font-black text-xs text-cyber-dark">SZ</span>
              </div>
              <span className="font-orbitron font-bold text-white">SERVERZONE</span>
              <span className="text-gray-600 text-xs font-golos">© 2026</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-gray-600 font-golos">
              {['Правила', 'Конфиденциальность', 'API', 'Партнёрам'].map(link => (
                <button key={link} className="hover:text-neon-green transition-colors">{link}</button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="online-dot" />
              <span className="text-xs text-gray-500 font-golos">Все системы работают</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
