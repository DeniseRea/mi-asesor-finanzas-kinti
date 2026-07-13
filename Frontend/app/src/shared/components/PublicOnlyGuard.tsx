'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/shared/lib/auth-context';

export function PublicOnlyGuard({ children, locale, allowAuthenticated = false }: { children: React.ReactNode; locale: 'es' | 'en'; allowAuthenticated?: boolean }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!allowAuthenticated && !isLoading && isAuthenticated) router.replace(`/${locale}/dashboard`);
  }, [allowAuthenticated, isAuthenticated, isLoading, locale, router]);

  if (isLoading) return <div role="status" aria-live="polite" className="grid min-h-dvh place-items-center"><span className="size-8 animate-spin rounded-full border-4 border-[#075b40] border-t-transparent"/><span className="sr-only">{locale === 'es' ? 'Cargando…' : 'Loading…'}</span></div>;
  if (!allowAuthenticated && isAuthenticated) return null;
  return <>{children}</>;
}
