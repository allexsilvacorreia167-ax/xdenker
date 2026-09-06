import { Link, useLocation } from 'react-router-dom';
import { X, Home, BarChart2, Vote, BookOpen, FileText, Phone, Landmark, Scale } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { path: '/', label: 'Início', icon: Home },
  { path: '/pesquisas', label: 'Pesquisas', icon: BarChart2 },
  { path: '/sistema-politico', label: 'Sistema Político', icon: Landmark },
  { path: '/judiciario', label: 'Judiciário', icon: Scale },
  { path: '/apuracao', label: 'Apuração', icon: Vote },
  { path: '/metodologia', label: 'Metodologia', icon: BookOpen },
  { path: '/blog', label: 'Blog', icon: FileText },
  { path: '/contato', label: 'Contato', icon: Phone },
];

export default function MobileMenu({ isOpen, onClose }) {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 lg:hidden"
        onClick={onClose}
      />

      {/* Drawer centralizado estilo protótipo */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-xs bg-slate-800 rounded-2xl z-50 shadow-2xl lg:hidden overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
          <span className="font-bold text-white text-lg">Menu</span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors ${active
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
              >
                <Icon size={18} className={active ? 'text-orange-400' : 'text-slate-400'} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {isAuthenticated && (
          <div className="px-5 py-4 border-t border-slate-700">
            <p className="text-sm text-slate-400 mb-2 truncate">{user.fullName}</p>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 rounded-lg"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </>
  );
}
