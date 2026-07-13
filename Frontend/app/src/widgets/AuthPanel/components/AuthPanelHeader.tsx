'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import type { Locale } from '@/shared/i18n/config';

interface AuthPanelHeaderProps {
  locale: Locale;
  changeLanguageLabel: string;
  changeThemeLabel: string;
  route: 'login' | 'register' | 'forgot-password' | 'reset-password';
  backHref?: string;
  backLabel?: string;
}

export function AuthPanelHeader({
  locale,
  changeLanguageLabel,
  route,
  backHref,
  backLabel,
}: AuthPanelHeaderProps) {
  const nextLocale = locale === 'es' ? 'en' : 'es';
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    return () => document.documentElement.classList.remove('dark');
  }, [route]);

  return (
    <header className={`flex shrink-0 items-center gap-3 px-5 pt-5 text-slate-600 sm:px-8 sm:pt-7 lg:px-10 ${backHref ? 'justify-between' : 'justify-end'}`}>
      {backHref && backLabel ? (
        <Link href={backHref} className="flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-[#075b40] transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075b40]">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          {backLabel}
        </Link>
      ) : null}

      <div className="flex items-center gap-3">
        <Link
          href={`/${nextLocale}/${route}`}
          hrefLang={nextLocale}
          aria-label={changeLanguageLabel}
          className="flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-semibold transition-colors hover:bg-emerald-50 hover:text-[#075b40] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075b40]"
        >
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
          </svg>
          <span className="uppercase">{locale}</span>
          <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </Link>
      </div>
    </header>
  );
}
