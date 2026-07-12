import { NewTransaction } from '@/pageviews/movements/NewTransaction';
export default async function Page({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; return <NewTransaction locale={locale === 'en' ? 'en' : 'es'}/>; }
