'use client';

import { Sidebar } from '@/widgets/Sidebar/components/Sidebar';
import { AuthGuard } from '@/shared/components/AuthGuard';

interface DashboardLayoutProps {
  children: React.ReactNode;
  locale: 'es' | 'en';
}

export function DashboardLayout({ children, locale }: DashboardLayoutProps) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <Sidebar currentLocale={locale} />
        {children}
      </div>
    </AuthGuard>
  );
}
