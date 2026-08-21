import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, HelpCircle, Compass, UserCheck, ExternalLink, FileText, LogOut
} from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';

const adminNav = [
  { path: '/html/adm', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { path: '/html/adm/candidatos', label: 'Candidatos', icon: Users },
  { path: '/html/adm/perguntas', label: 'Perguntas', icon: HelpCircle },
  { path: '/html/adm/espectro', label: 'Espectro Político', icon: Compass },
  { path: '/html/adm/blog', label: 'Blog', icon: FileText },
  { path: '/html/adm/usuarios', label: 'Usuários', icon: UserCheck },
];

/**
 * Layout Desktop do Painel Administrativo
 * Alterações aqui refletem na área pública do usuário
 * Protegido por sessão de administrador (JWT)
 */
export default function AdminDesktopLayout() {
  const location = useLocation();
  const { isAuthenticated, admin, logout, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-pulse text-slate-400">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/html/adm/login" replace />;
  }

  const isActive = (item) => {
    if (item.end) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0">
        <div className="px-5 py-5 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="XDENKER"
              className="h-8 w-auto object-contain brightness-0 invert"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">Painel Administrativo</p>
        </div>

        <nav className="flex-1 py-4">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${active
                  ? 'bg-slate-800 text-white border-r-2 border-orange-500'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
              >
                <Icon size={18} className={active ? 'text-orange-400' : ''} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700 space-y-3">
          {admin?.email && (
            <p className="text-xs text-slate-500 truncate">{admin.email}</p>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white w-full"
          >
            <LogOut size={16} />
            Sair
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <ExternalLink size={16} />
            Ver site público
          </Link>
        </div>
      </aside>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <h1 className="text-lg font-semibold text-slate-800">
            Gestão XDENKER
          </h1>
          <p className="text-xs text-slate-500">
            Alterações refletem em tempo real na área do usuário
          </p>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}