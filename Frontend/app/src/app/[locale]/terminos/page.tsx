import type { Metadata } from 'next';
import { LegalDocument } from '@/pageviews/legal/LegalDocument';
import type { Locale } from '@/shared/i18n/config';

export const metadata: Metadata = {
  title: 'Términos y condiciones | Kinti',
  description: 'Términos de uso del servicio Kinti.',
};

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale: Locale = locale === 'en' ? 'en' : 'es';
  return <LegalDocument locale={currentLocale} kind="terms" />;
}
