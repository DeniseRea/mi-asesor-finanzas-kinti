import { getDictionary } from '@/shared/i18n/getDictionary';
import { Home } from '@/pageviews/home/Home';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = (locale === 'en' ? 'en' : 'es') as 'es' | 'en';
  const dict = await getDictionary(currentLocale);

  return <Home dict={dict} />;
}
