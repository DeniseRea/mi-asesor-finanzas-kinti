import './globals.css';
import { Sidebar } from '@/widgets/Sidebar/components/Sidebar';

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
    <html lang={currentLocale}>
      <body className="flex min-h-screen bg-slate-950 text-slate-100">
        <Sidebar currentLocale={currentLocale} />
        <div className="flex-1 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
