import { PasswordRecovery } from '@/pageviews/passwordRecovery/PasswordRecovery';
import { getPasswordRecoveryDictionary } from '@/shared/i18n/dictionaries/passwordRecovery';
import { PublicOnlyGuard } from '@/shared/components/PublicOnlyGuard';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ResetPasswordPage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = locale === 'en' ? 'en' : 'es';
  const dict = getPasswordRecoveryDictionary(currentLocale);

  return <PublicOnlyGuard locale={currentLocale}><PasswordRecovery dict={dict} locale={currentLocale} /></PublicOnlyGuard>;
}
