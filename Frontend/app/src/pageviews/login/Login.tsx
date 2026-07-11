import Image from 'next/image';
import { LoginForm } from '@/features/auth/components/LoginForm';
import type { Locale } from '@/shared/i18n/config';
import type { LoginDictionary } from '@/shared/i18n/dictionaries/login';
import { LoginJourney } from './components/LoginJourney';

interface LoginProps {
  dict: LoginDictionary;
  locale: Locale;
}

export function Login({ dict, locale }: LoginProps) {
  const nextLocale = locale === 'es' ? 'en' : 'es';

  return (
    <main className="relative isolate flex min-h-dvh w-full items-center justify-center overflow-hidden bg-[#dfe9d9] p-3 sm:p-5 lg:justify-end lg:p-8 xl:p-10">
      <Image
        src="/assets/login/login-background.webp"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover object-center"
        priority
        unoptimized
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,48,35,0.04)_0%,rgba(8,48,35,0)_52%,rgba(8,48,35,0.08)_100%)]" />
      <LoginJourney journey={dict.journey} />

      <section
        aria-label={dict.submit}
        className="relative z-10 flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[39rem] flex-col overflow-y-auto rounded-[1.5rem] border border-white/80 bg-white/95 shadow-[0_24px_80px_rgba(18,58,43,0.18)] backdrop-blur-md sm:max-h-[calc(100dvh-2.5rem)] lg:max-h-[calc(100dvh-4rem)]"
      >
        <header className="flex shrink-0 items-center justify-end gap-3 px-5 pt-5 text-slate-600 sm:px-8 sm:pt-7 lg:px-10">
          <a
            href={`/${nextLocale}/login`}
            hrefLang={nextLocale}
            aria-label={dict.changeLanguage}
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
          </a>

          <span aria-hidden="true" className="h-7 w-px bg-slate-200" />

          <button
            type="button"
            aria-label={dict.changeTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-[#075b40] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075b40]"
          >
            <svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          </button>
        </header>

        <div className="flex flex-1 items-center px-5 pb-7 pt-5 sm:px-8 sm:pb-9 lg:px-14 lg:pb-12 lg:pt-7">
          <LoginForm dict={dict} />
        </div>
      </section>
    </main>
  );
}
