import type { Locale } from '@/shared/i18n/config';
import type { ForgotPasswordDictionary } from '@/shared/i18n/dictionaries/forgotPassword';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';
import { AuthBackground } from '@/widgets/AuthBackground/components/AuthBackground';
import { AuthPanelHeader } from '@/widgets/AuthPanel/components/AuthPanelHeader';
import { ForgotPasswordHero } from './components/ForgotPasswordHero';

interface ForgotPasswordProps {
  dict: ForgotPasswordDictionary;
  locale: Locale;
}

export function ForgotPassword({ dict, locale }: ForgotPasswordProps) {
  return (
    <main className="relative isolate flex min-h-dvh w-full items-start justify-center overflow-y-auto bg-[#e7efdf] px-3 pb-6 pt-48 sm:px-5 md:items-center md:overflow-hidden md:p-8 lg:justify-end xl:p-10">
      <AuthBackground />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,48,35,0.04)_0%,rgba(8,48,35,0)_52%,rgba(8,48,35,0.08)_100%)]" />
      <ForgotPasswordHero hero={dict.hero} />
      <section aria-label={dict.title} className="auth-panel-enter relative z-10 flex min-h-156 w-full max-w-156 flex-col overflow-visible rounded-3xl border border-white/80 bg-white/95 shadow-[0_24px_80px_rgba(18,58,43,0.18)] backdrop-blur-md md:max-h-[calc(100dvh-4rem)] md:overflow-y-auto">
        <AuthPanelHeader locale={locale} route="forgot-password" changeLanguageLabel={dict.changeLanguage} changeThemeLabel={dict.changeTheme} backHref={`/${locale}/login`} backLabel={dict.backToLogin} />
        <div className="flex flex-1 items-center px-5 pb-8 pt-6 sm:px-8 lg:px-12 lg:pb-10 lg:pt-8"><ForgotPasswordForm dict={dict} locale={locale} /></div>
      </section>
    </main>
  );
}
