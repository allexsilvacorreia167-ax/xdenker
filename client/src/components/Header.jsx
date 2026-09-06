import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import LoginModal from './LoginModal';
import { Menu, LogOut } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Início' },
  { path: '/pesquisas', label: 'Pesquisas' },
  { path: '/sistema-politico', label: 'Sistema Político' },
  { path: '/metodologia', label: 'Metodologia' },
  { path: '/blog', label: 'Blog' },
  { path: '/contato', label: 'Contato' },
];

export default function Header({ onOpenMobileMenu, forceMobile = false, forceDesktop = false }) {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginStep, setLoginStep] = useState('credentials');
  const [tempCredentials, setTempCredentials] = useState({ fullName: '', email: '' });

  const handleLoginClick = () => {
    setLoginStep('credentials');
    setShowLoginModal(true);
  };

  const getShortName = (fullName) => {
    if (!fullName) return '';
    return fullName.trim().split(' ')[0];
  };

  return (
    <>
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo — client/public/logo.png */}
            <Link to="/" className="flex items-center gap-1.5 flex-shrink-0">
              <img
                src="/logo.png"
                alt="XDENKER"
                className="h-8 md:h-10 w-auto object-contain"
              />
            </Link>

            {/* Menu Desktop */}
            <nav className={`${forceMobile ? "hidden" : forceDesktop ? "flex" : "hidden lg:flex"} items-center gap-1`}>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Auth Desktop */}
            <div className={`${forceMobile ? "hidden" : forceDesktop ? "flex" : "hidden lg:flex"} items-center gap-3`}>
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    {getShortName(user.fullName)}
                  </span>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <LogOut size={14} />
                    Sair
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Nome Completo"
                    className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={tempCredentials.fullName}
                    onChange={(e) =>
                      setTempCredentials((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={tempCredentials.email}
                    onChange={(e) =>
                      setTempCredentials((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                  <button
                    onClick={handleLoginClick}
                    className="bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors"
                  >
                    ENTRAR
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Auth */}
            <div className={`${forceDesktop ? "hidden" : forceMobile ? "flex" : "lg:hidden flex"} items-center gap-2`}>
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    {getShortName(user.fullName)}
                  </span>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1 bg-red-500 text-white text-xs font-medium px-2.5 py-1 rounded-md"
                  >
                    <LogOut size={12} />
                    Sair
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    placeholder="Nome Completo"
                    className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={tempCredentials.fullName}
                    onChange={(e) =>
                      setTempCredentials((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={tempCredentials.email}
                    onChange={(e) =>
                      setTempCredentials((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                  <button
                    onClick={handleLoginClick}
                    className="bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                  >
                    ENTRAR
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Botão hambúrguer flutuante — só no layout mobile */}
      {!forceDesktop && (
        <button
          onClick={onOpenMobileMenu}
          className={`${forceMobile ? 'flex' : 'lg:hidden flex'} fixed bottom-6 right-5 z-50 w-12 h-12 bg-slate-800 text-white rounded-full shadow-lg items-center justify-center active:scale-95 transition-transform`}
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>
      )}

      {showLoginModal && (
        <LoginModal
          step={loginStep}
          setStep={setLoginStep}
          credentials={tempCredentials}
          setCredentials={setTempCredentials}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </>
  );
}
