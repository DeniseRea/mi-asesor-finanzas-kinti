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
    <main className="relative isolate flex min-h-dvh w-full items-center justify-center overflow-hidden bg-[#e7efdf] p-3 sm:p-5 lg:justify-end lg:p-8 xl:p-10">
      <AuthBackground />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,48,35,0.04)_0%,rgba(8,48,35,0)_52%,rgba(8,48,35,0.08)_100%)]" />
      <ForgotPasswordHero hero={dict.hero} />
      <section aria-label={dict.title} className="auth-panel-enter relative z-10 flex max-h-[calc(100dvh-1.5rem)] min-h-[39rem] w-full max-w-[39rem] flex-col overflow-y-auto rounded-[1.5rem] border border-white/80 bg-white/95 shadow-[0_24px_80px_rgba(18,58,43,0.18)] backdrop-blur-md sm:max-h-[calc(100dvh-2.5rem)] lg:max-h-[calc(100dvh-4rem)]">
        <AuthPanelHeader locale={locale} route="forgot-password" changeLanguageLabel={dict.changeLanguage} changeThemeLabel={dict.changeTheme} backHref={`/${locale}/login`} backLabel={dict.backToLogin} />
        <div className="flex flex-1 items-center px-5 pb-8 pt-6 sm:px-8 lg:px-12 lg:pb-10 lg:pt-8"><ForgotPasswordForm dict={dict} locale={locale} /></div>
      </section>
    </main>
  );
}
