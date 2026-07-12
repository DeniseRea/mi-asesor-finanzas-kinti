'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, MoreHorizontal } from 'lucide-react';
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useFinance } from '@/entities/finance/model/FinanceProvider';
import { AppCard } from '@/shared/components/AppCard';
import { Modal } from '@/shared/components/Modal';
import { BudgetForm } from '@/features/budgets/components/BudgetForm';

type BudgetStateKey = 'safe' | 'near' | 'over';
function status(percent: number, threshold: number): { label: string; color: string; bar: string; key: BudgetStateKey } { return percent >= 100 ? { label: 'Excedido', color: 'bg-rose-100 text-rose-700', bar: 'bg-rose-500', key: 'over' } : percent >= threshold ? { label: 'Cerca del límite', color: 'bg-orange-100 text-orange-700', bar: 'bg-orange-500', key: 'near' } : { label: 'Dentro del límite', color: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-600', key: 'safe' }; }

export function Budgets({ locale }: { locale: 'es' | 'en' }) {
  const { budgets, expensesByCategory, formatMoney } = useFinance();
  const [open, setOpen] = useState(false);
  useEffect(() => { const openForm = () => setOpen(true); window.addEventListener('kinti:new-budget', openForm); return () => window.removeEventListener('kinti:new-budget', openForm); }, []);
  const total = budgets.reduce((sum,item) => sum + item.limit,0);
  const spent = budgets.reduce((sum,item) => sum + (expensesByCategory[item.category] ?? 0),0);
  const counts = budgets.reduce((result, budget) => { const key = status((expensesByCategory[budget.category] ?? 0) / budget.limit * 100, budget.threshold).key; result[key] += 1; return result; }, { safe: 0, near: 0, over: 0 });
  const statusData = [{ name: 'Dentro del límite', value: counts.safe, color: '#15803d', fill: '#15803d' },{ name: 'Cerca del límite', value: counts.near, color: '#f59e0b', fill: '#f59e0b' },{ name: 'Excedido', value: counts.over, color: '#f43f5e', fill: '#f43f5e' }];
  return <div className="space-y-6">
    <AppCard className="grid gap-5 p-5 md:grid-cols-2 xl:grid-cols-[1.15fr_repeat(3,1fr)_1.4fr] xl:items-center">
      <div><p className="text-sm font-bold">Resumen del mes</p><button className="mt-3 flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold"><CalendarDays size={17}/>Julio 2026</button></div>
      <div className="xl:border-l xl:border-slate-100 xl:pl-5"><p className="text-xs font-semibold text-slate-500">Presupuesto total</p><strong className="mt-2 block text-2xl">{formatMoney(total)}</strong><span className="text-slate-500">{budgets.length} categorías</span></div>
      <div className="xl:border-l xl:border-slate-100 xl:pl-5"><p className="text-xs font-semibold text-slate-500">Gastado total</p><strong className="mt-2 block text-2xl">{formatMoney(spent)}</strong><span className="font-semibold text-orange-600">{Math.round(spent/total*100)}% del presupuesto</span></div>
      <div className="xl:border-l xl:border-slate-100 xl:pl-5"><p className="text-xs font-semibold text-slate-500">Disponible</p><strong className="mt-2 block text-2xl text-emerald-700">{formatMoney(total-spent)}</strong><span className="text-slate-500">{Math.round((total-spent)/total*100)}% restante</span></div>
      <div className="flex min-w-0 items-center gap-2 xl:border-l xl:border-slate-100 xl:pl-4"><div className="h-28 w-28 shrink-0"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statusData} dataKey="value" innerRadius="48%" outerRadius="72%" paddingAngle={2} /><Tooltip/></PieChart></ResponsiveContainer></div><div className="min-w-0 space-y-2">{statusData.map((item) => <div key={item.name} className="flex items-center gap-2 text-xs"><span className="size-2.5 rounded-full" style={{background:item.color}}/><span className="min-w-0 flex-1 truncate text-slate-500">{item.name}</span><strong>{item.value}</strong></div>)}</div></div>
    </AppCard>
    <div className="grid gap-4 xl:grid-cols-[1fr_19rem]">
      <AppCard className="max-h-[calc(100dvh-27rem)] min-h-96 overflow-y-auto"><div className="sticky top-0 z-10 hidden grid-cols-[1.4fr_repeat(4,1fr)_auto] gap-4 bg-slate-50 px-5 py-4 text-xs font-semibold text-slate-500 shadow-[0_1px_0_#e2e8f0] md:grid"><span>Categoría</span><span>Presupuesto</span><span>Gastado</span><span>Progreso</span><span>Estado</span><span/></div><div className="divide-y divide-slate-100">{budgets.map((budget) => { const used = expensesByCategory[budget.category] ?? 0; const percent = Math.round(used / budget.limit * 100); const state = status(percent,budget.threshold); return <Link href={`/${locale}/dashboard/presupuestos/${budget.id}`} key={budget.id} className="grid gap-3 p-5 md:grid-cols-[1.4fr_repeat(4,1fr)_auto] md:items-center"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full" style={{backgroundColor:`${budget.color}16`,color:budget.color}}>{budget.icon}</span><span><strong className="block text-sm">{budget.category}</strong><span className="text-slate-500">Mensual</span></span></div><span className="text-sm font-semibold">{formatMoney(budget.limit)}</span><span className="text-sm font-bold">{formatMoney(used)}</span><div><div className="mb-1 text-xs">{percent}%</div><div className="h-2 rounded-full bg-slate-100"><div className={`h-2 rounded-full ${state.bar}`} style={{ width: `${Math.min(percent,100)}%` }}/></div></div><span className={`w-fit rounded-lg px-2 py-1 text-xs font-semibold ${state.color}`}>{state.label}</span><MoreHorizontal size={17}/></Link>; })}</div></AppCard>
      <div className="space-y-4"><AppCard className="relative min-h-60 overflow-hidden bg-linear-to-br from-emerald-50 to-lime-50 p-5"><p className="text-sm font-bold text-emerald-900">Consejo del día</p><p className="relative z-10 mt-3 max-w-[72%] text-sm leading-6 text-emerald-800">Vas bien con tus presupuestos. Revisa especialmente las categorías en naranja.</p><Image src="/assets/login/kinti-bird.png" alt="" width={80} height={80} className="absolute bottom-10 right-4 z-10 w-16 object-contain"/><Image src="/assets/app/leaves.svg" alt="" width={160} height={110} className="absolute -bottom-5 -right-6 w-40 opacity-80"/></AppCard><AppCard className="p-5"><h2 className="font-bold">Alertas</h2>{budgets.filter((budget) => (expensesByCategory[budget.category] ?? 0) / budget.limit >= budget.threshold / 100).map((budget) => <div key={budget.id} className="mt-4 border-t border-slate-100 pt-4"><p className="text-sm font-semibold">{budget.category}</p><p className="text-xs text-slate-500">{Math.round((expensesByCategory[budget.category] ?? 0)/budget.limit*100)}% utilizado</p></div>)}</AppCard></div>
    </div>
    <Modal open={open} onCloseAction={() => setOpen(false)} title="Nuevo presupuesto"><BudgetForm onSavedAction={() => setOpen(false)}/></Modal>
  </div>;
}
