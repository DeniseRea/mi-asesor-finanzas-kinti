import { PasswordRecovery } from '@/pageviews/passwordRecovery/PasswordRecovery';
import { getPasswordRecoveryDictionary } from '@/shared/i18n/dictionaries/passwordRecovery';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ResetPasswordPage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = locale === 'en' ? 'en' : 'es';
  const dict = getPasswordRecoveryDictionary(currentLocale);

  return <PasswordRecovery dict={dict} locale={currentLocale} />;
}
