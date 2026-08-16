import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import MobileMenu from '../components/MobileMenu';
import { useState } from 'react';

export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
