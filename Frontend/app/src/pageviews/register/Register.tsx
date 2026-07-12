import type { Locale } from '@/shared/i18n/config';
import type { RegisterDictionary } from '@/shared/i18n/dictionaries/register';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { AuthPanelHeader } from '@/widgets/AuthPanel/components/AuthPanelHeader';
import { AuthBackground } from '@/widgets/AuthBackground/components/AuthBackground';
import { RegisterHero } from './components/RegisterHero';

interface RegisterProps {
  dict: RegisterDictionary;
  locale: Locale;
}

export function Register({ dict, locale }: RegisterProps) {
  return (
    <main className="relative isolate flex min-h-dvh w-full items-start justify-center overflow-y-auto bg-[#e7efdf] px-3 pb-6 pt-16 sm:px-5 md:items-center md:overflow-hidden md:p-8 lg:justify-end xl:p-10">
      <AuthBackground />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,48,35,0.04)_0%,rgba(8,48,35,0)_52%,rgba(8,48,35,0.08)_100%)]" />
      <RegisterHero brandName={dict.brandName} hero={dict.hero} />

      <section aria-label={dict.title} className="auth-panel-enter relative z-10 flex w-full max-w-156 flex-col overflow-visible rounded-3xl border border-white/80 bg-white/95 shadow-[0_24px_80px_rgba(18,58,43,0.18)] backdrop-blur-md md:max-h-[calc(100dvh-4rem)] md:overflow-y-auto">
        <AuthPanelHeader locale={locale} route="register" changeLanguageLabel={dict.changeLanguage} changeThemeLabel={dict.changeTheme} backHref={`/${locale}/login`} backLabel={dict.backToLogin} />
        <div className="flex flex-1 items-center px-5 pb-6 pt-4 sm:px-8 sm:pb-8 lg:px-12 lg:pb-9 lg:pt-5">
          <RegisterForm dict={dict} locale={locale} />
        </div>
      </section>
    </main>
  );
}
