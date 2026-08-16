import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import MobileMenu from '../components/MobileMenu';
import { useState } from 'react';

/**
 * Layout exclusivo Mobile (usuário)
 * - Header compacto
 * - Botão hambúrguer flutuante
 * - Drawer de menu
 */
export default function UserMobileLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header onOpenMobileMenu={() => setMenuOpen(true)} forceMobile />
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
