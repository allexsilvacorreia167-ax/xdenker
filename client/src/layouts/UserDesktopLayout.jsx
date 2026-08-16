import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

/**
 * Layout exclusivo Desktop (usuário)
 * - Header completo com menu horizontal
 * - Login inline no topo
 * - Sem botão hambúrguer
 */
export default function UserDesktopLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header forceDesktop />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
