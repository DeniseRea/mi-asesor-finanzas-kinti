import { Budgets } from '@/pageviews/budgets/Budgets';
export default async function Page({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; return <Budgets locale={locale === 'en' ? 'en' : 'es'}/>; }
