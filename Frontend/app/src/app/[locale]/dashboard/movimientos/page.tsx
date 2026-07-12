import { Movements } from '@/pageviews/movements/Movements';
export default async function Page({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; return <Movements locale={locale === 'en' ? 'en' : 'es'}/>; }
