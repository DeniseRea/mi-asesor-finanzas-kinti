'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/shared/lib/auth-context';
import { getAuthErrorMessage } from '@/features/auth/lib/auth-errors';
import type { Locale } from '@/shared/i18n/config';

function CallbackHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { completeExternalLogin } = useAuth();
  const locale = (pathname.split('/')[1] === 'en' ? 'en' : 'es') as Locale;
  const token = searchParams.get('token');
  const [error, setError] = useState(() => token ? '' : (locale === 'es' ? 'No recibimos una autorización válida. Vuelve a iniciar sesión.' : 'We did not receive a valid authorization. Please sign in again.'));

  useEffect(() => {
    if (!token) return;
    window.history.replaceState({ ...window.history.state }, '', pathname);
    let active = true;
    completeExternalLogin(token)
      .then(() => { if (active) router.replace(`/${locale}/dashboard`); })
      .catch((reason) => { if (active) setError(getAuthErrorMessage(reason, locale)); });
    return () => { active = false; };
  }, [completeExternalLogin, locale, pathname, router, token]);

  return <div className="flex min-h-dvh items-center justify-center bg-slate-950 p-6 text-center text-white">{error ? <div role="alert" className="max-w-md rounded-2xl border border-rose-400/30 bg-slate-900 p-6"><h1 className="text-xl font-bold">{locale === 'es' ? 'No pudimos completar el acceso' : 'We could not complete sign-in'}</h1><p className="mt-3 text-sm leading-6 text-slate-300">{error}</p><Link href={`/${locale}/login`} className="mt-5 inline-flex rounded-xl bg-emerald-700 px-5 py-3 font-bold">{locale === 'es' ? 'Volver al inicio de sesión' : 'Back to sign in'}</Link></div> : <div role="status" aria-live="polite"><div className="mx-auto size-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"/><p className="mt-4 text-sm text-slate-300">{locale === 'es' ? 'Verificando tu acceso…' : 'Verifying your access…'}</p></div>}</div>;
}

export default function AuthCallbackPage() {
  return <Suspense fallback={<div role="status" className="grid min-h-dvh place-items-center bg-slate-950 text-slate-300">Procesando…</div>}><CallbackHandler /></Suspense>;
}
