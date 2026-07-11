import { getDictionary } from '@/shared/i18n/getDictionary';
import { Home } from '@/pageviews/home/Home';

interface PageProps {
  params: Promise<{ locale: 'es' | 'en' }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return <Home dict={dict} />;
}
