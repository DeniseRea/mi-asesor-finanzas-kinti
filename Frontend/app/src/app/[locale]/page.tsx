import { getHomeDictionary } from '@/shared/i18n/dictionaries/home';
import { Home } from '@/pageviews/home/Home';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = (locale === 'en' ? 'en' : 'es') as 'es' | 'en';
  const dict = getHomeDictionary(currentLocale);

  return <Home dict={dict} />;
}
