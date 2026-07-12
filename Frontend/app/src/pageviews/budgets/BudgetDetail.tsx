'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useFinance } from '@/entities/finance/model/FinanceProvider';
import { AppCard } from '@/shared/components/AppCard';
import { MetricCard } from '@/shared/components/MetricCard';

export function BudgetDetail({ id, locale }: { id: string; locale: 'es' | 'en' }) {
  const { budgets, expensesByCategory, transactions, dispatch, formatMoney } = useFinance(); const router = useRouter(); const budget = budgets.find((item) => item.id === id);
  if (!budget) return <AppCard className="p-10 text-center">Presupuesto no encontrado.</AppCard>;
  const spent = expensesByCategory[budget.category] ?? 0; const related = transactions.filter((item) => item.category === budget.category); const chart = [20,35,51,62,78,spent].map((value,index) => ({ day: `${index*5+1} Jul`, value }));
  const remove = () => { if (window.confirm('¿Eliminar este presupuesto?')) { dispatch({ type: 'deleteBudget', payload: id }); router.push(`/${locale}/dashboard/presupuestos`); } };
  return <div className="space-y-6"><button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-semibold text-slate-600"><ArrowLeft size={17}/>Volver</button><div className="flex items-end justify-between"><div><h1 className="text-3xl font-black">{budget.category}</h1><p className="mt-1 text-slate-500">Presupuesto mensual · alerta al {budget.threshold}%</p></div><button onClick={remove} className="rounded-xl border border-rose-200 p-3 text-rose-600"><Trash2 size={18}/></button></div><div className="grid grid-cols-3 gap-3"><MetricCard title="Presupuesto" value={formatMoney(budget.limit)} icon={<span>{budget.icon}</span>}/><MetricCard title="Gastado" value={formatMoney(spent)} tone={spent > budget.limit ? 'red' : 'orange'} icon={<span>↑</span>}/><MetricCard title="Restante" value={formatMoney(budget.limit-spent)} icon={<span>↓</span>}/></div><div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]"><AppCard className="p-5"><h2 className="mb-4 font-bold">Evolución del gasto</h2><div className="h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chart}><defs><linearGradient id="budgetFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#16a34a" stopOpacity=".25"/><stop offset="1" stopColor="#16a34a" stopOpacity="0"/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="day"/><YAxis/><Tooltip/><Area type="monotone" dataKey="value" stroke="#15803d" fill="url(#budgetFill)"/></AreaChart></ResponsiveContainer></div></AppCard><AppCard className="p-5"><h2 className="font-bold">Movimientos relacionados</h2><div className="mt-3 divide-y divide-slate-100">{related.map((item) => <div key={item.id} className="flex justify-between py-3 text-sm"><span><strong className="block">{item.merchant}</strong><small className="text-slate-500">{item.description}</small></span><strong>-{formatMoney(item.amount)}</strong></div>)}</div></AppCard></div></div>;
}
