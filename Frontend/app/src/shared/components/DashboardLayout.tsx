'use client';

import { useState } from 'react';
import { useFinance } from '@/entities/finance/model/FinanceProvider';
import { MobileNav } from '@/widgets/AppShell/components/MobileNav';
import { NotificationDrawer } from '@/widgets/AppShell/components/NotificationDrawer';
import { Topbar } from '@/widgets/AppShell/components/Topbar';
import { Sidebar } from '@/widgets/Sidebar/components/Sidebar';
import { AuthGuard } from './AuthGuard';

export function DashboardLayout({ children, locale }: { children: React.ReactNode; locale: 'es' | 'en' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { preferences } = useFinance();

  return (
    <AuthGuard>
      <div className={preferences.darkMode ? 'dark' : ''}>
        <div className="flex h-dvh overflow-hidden bg-[#f7f9f8] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
          <button
            aria-label="Cerrar menú"
            onClick={() => setMenuOpen(false)}
            className={`fixed inset-0 z-40 bg-slate-950/30 lg:hidden ${menuOpen ? 'block' : 'hidden'}`}
          />
          <Sidebar currentLocale={locale} open={menuOpen} onCloseAction={() => setMenuOpen(false)} />
          <div className="flex h-dvh min-w-0 flex-1 flex-col overflow-hidden">
            <Topbar
              locale={locale}
              onMenuAction={() => setMenuOpen(true)}
              onNotificationsAction={() => setNotificationsOpen(true)}
            />
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <main className="mx-auto w-full max-w-[104rem] p-[clamp(1rem,2.2vw,2rem)] pb-24 lg:pb-8">{children}</main>
            </div>
          </div>
          <MobileNav locale={locale} />
          <NotificationDrawer open={notificationsOpen} onCloseAction={() => setNotificationsOpen(false)} />
        </div>
      </div>
    </AuthGuard>
  );
}
