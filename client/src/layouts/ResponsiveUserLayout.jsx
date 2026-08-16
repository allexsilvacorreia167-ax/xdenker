import { useState, useEffect } from 'react';
import UserMobileLayout from './UserMobileLayout';
import UserDesktopLayout from './UserDesktopLayout';

/**
 * Escolhe automaticamente o layout de usuário (mobile ou desktop)
 * Os dois layouts estão separados, mas conectados pela mesma árvore de rotas
 */
export default function ResponsiveUserLayout() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 1024 : true
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return isMobile ? <UserMobileLayout /> : <UserDesktopLayout />;
}
