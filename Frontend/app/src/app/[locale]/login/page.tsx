import { getLoginDictionary } from '@/shared/i18n/dictionaries/login';
import { Login } from '@/pageviews/login/Login';
import { PublicOnlyGuard } from '@/shared/components/PublicOnlyGuard';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function LoginPage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = (locale === 'en' ? 'en' : 'es') as 'es' | 'en';
  const dict = getLoginDictionary(currentLocale);

  return <PublicOnlyGuard locale={currentLocale}><Login dict={dict} locale={currentLocale} /></PublicOnlyGuard>;
}
