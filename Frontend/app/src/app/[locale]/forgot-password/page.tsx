import { ForgotPassword } from '@/pageviews/forgotPassword/ForgotPassword';
import { getForgotPasswordDictionary } from '@/shared/i18n/dictionaries/forgotPassword';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ForgotPasswordPage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = locale === 'en' ? 'en' : 'es';
  const dict = getForgotPasswordDictionary(currentLocale);

  return <ForgotPassword dict={dict} locale={currentLocale} />;
}
