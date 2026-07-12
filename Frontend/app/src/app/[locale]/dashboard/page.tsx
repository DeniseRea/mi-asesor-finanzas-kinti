import { Dashboard } from '@/pageviews/dashboard/Dashboard';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = (locale === 'en' ? 'en' : 'es') as 'es' | 'en';
  return <Dashboard locale={currentLocale} />;
}
