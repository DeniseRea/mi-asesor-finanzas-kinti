import './globals.css';
import { Providers } from '@/app/Providers';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kinti - Mi Asesor de Finanzas',
  description: 'Controla tus finanzas de manera inteligente',
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;
  const currentLocale = (locale === 'en' ? 'en' : 'es') as 'es' | 'en';

  return (
    <html lang={currentLocale}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
