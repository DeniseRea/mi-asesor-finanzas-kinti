import { getDashboardDictionary } from '@/shared/i18n/dictionaries/dashboard';
import { Dashboard } from '@/pageviews/dashboard/Dashboard';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = (locale === 'en' ? 'en' : 'es') as 'es' | 'en';
  const dict = getDashboardDictionary(currentLocale);

  return <Dashboard dict={dict} />;
}
