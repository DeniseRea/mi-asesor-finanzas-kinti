import type { Metadata } from 'next';
import { LegalDocument } from '@/pageviews/legal/LegalDocument';
import type { Locale } from '@/shared/i18n/config';

export const metadata: Metadata = {
  title: 'Política de privacidad | Kinti',
  description: 'Cómo Kinti utiliza y protege tu información.',
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale: Locale = locale === 'en' ? 'en' : 'es';
  return <LegalDocument locale={currentLocale} kind="privacy" />;
}
