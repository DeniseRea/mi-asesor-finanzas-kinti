import { Register } from '@/pageviews/register/Register';
import { getRegisterDictionary } from '@/shared/i18n/dictionaries/register';
import { PublicOnlyGuard } from '@/shared/components/PublicOnlyGuard';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function RegisterPage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = locale === 'en' ? 'en' : 'es';
  const dict = getRegisterDictionary(currentLocale);

  return <PublicOnlyGuard locale={currentLocale}><Register dict={dict} locale={currentLocale} /></PublicOnlyGuard>;
}
