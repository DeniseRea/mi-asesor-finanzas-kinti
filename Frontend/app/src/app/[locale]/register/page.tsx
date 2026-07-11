import { Register } from '@/pageviews/register/Register';
import { getRegisterDictionary } from '@/shared/i18n/dictionaries/register';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function RegisterPage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = locale === 'en' ? 'en' : 'es';
  const dict = getRegisterDictionary(currentLocale);

  return <Register dict={dict} locale={currentLocale} />;
}
