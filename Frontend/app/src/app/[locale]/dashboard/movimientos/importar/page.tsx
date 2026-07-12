import { ImportMovements } from '@/pageviews/movements/ImportMovements';
export default async function Page({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; return <ImportMovements locale={locale === 'en' ? 'en' : 'es'}/>; }
