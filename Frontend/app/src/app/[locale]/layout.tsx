import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata = {
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
    <html lang={currentLocale} className={inter.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}
