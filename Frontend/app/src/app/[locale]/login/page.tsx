import { getLoginDictionary } from '@/shared/i18n/dictionaries/login';
import { Login } from '@/pageviews/login/Login';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function LoginPage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = (locale === 'en' ? 'en' : 'es') as 'es' | 'en';
  const dict = getLoginDictionary(currentLocale);

  return <Login dict={dict} locale={currentLocale} />;
}
