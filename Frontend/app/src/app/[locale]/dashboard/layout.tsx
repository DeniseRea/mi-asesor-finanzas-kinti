import { DashboardLayout } from '@/shared/components/DashboardLayout';

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <DashboardLayout locale={locale === 'en' ? 'en' : 'es'}>{children}</DashboardLayout>;
}
