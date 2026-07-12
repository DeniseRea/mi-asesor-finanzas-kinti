import { MovementDetail } from '@/pageviews/movements/MovementDetail';
export default async function Page({ params }: { params: Promise<{ locale: string; id: string }> }) { const { locale, id } = await params; return <MovementDetail locale={locale === 'en' ? 'en' : 'es'} id={id}/>; }
