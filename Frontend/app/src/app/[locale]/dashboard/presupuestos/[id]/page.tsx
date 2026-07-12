import { BudgetDetail } from '@/pageviews/budgets/BudgetDetail';
export default async function Page({ params }: { params: Promise<{ locale: string; id: string }> }) { const { locale, id } = await params; return <BudgetDetail locale={locale === 'en' ? 'en' : 'es'} id={id}/>; }
