import { getDictionary } from '@/shared/i18n/getDictionary';
import { Dashboard } from '@/pageviews/dashboard/Dashboard';

interface PageProps {
  params: Promise<{ locale: 'es' | 'en' }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return <Dashboard dict={dict} />;
}
