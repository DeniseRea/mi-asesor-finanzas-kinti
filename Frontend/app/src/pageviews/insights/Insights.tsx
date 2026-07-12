'use client';

import { BarChart3, CalendarDays, PiggyBank, Target, TrendingUp } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useFinance } from '@/entities/finance/model/FinanceProvider';
import { AppCard } from '@/shared/components/AppCard';
import { MetricCard } from '@/shared/components/MetricCard';

const evolution = [{ day: '1 Jun', income: 1100, expense: 720 },{ day: '8 Jun', income: 1500, expense: 950 },{ day: '15 Jun', income: 2050, expense: 1180 },{ day: '22 Jun', income: 2450, expense: 1380 },{ day: '29 Jun', income: 2700, expense: 1520 },{ day: '6 Jul', income: 3100, expense: 1850 },{ day: 'Hoy', income: 3250, expense: 2050 }];
const week = [{ day:'Lun',value:60},{day:'Mar',value:105},{day:'Mié',value:152},{day:'Jue',value:136},{day:'Vie',value:255},{day:'Sáb',value:210},{day:'Dom',value:122}];
const colors = ['#15803d','#7c3aed','#f59e0b','#f43f5e','#3b82f6','#94a3b8'];

export function Insights() {
  const { summary, expensesByCategory, formatMoney } = useFinance();
  const data = Object.entries(expensesByCategory).map(([name,value]) => ({name,value}));
  const largest = [...data].sort((a,b) => b.value-a.value)[0];
  const savings = summary.income ? Math.round(summary.balance/summary.income*100) : 0;
  return <div className="space-y-6">
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 2xl:grid-cols-5">
      <MetricCard title="Balance del periodo" value={formatMoney(summary.balance)} detail="↑ 8.5% vs. periodo anterior" trend={[18,23,21,29,24,35,31,39,36,48]} icon={<TrendingUp size={19}/>}/>
      <MetricCard title="Tasa de ahorro" value={`${savings}%`} detail="↑ 6 p.p. vs. periodo anterior" trend={[20,25,22,31,27,35,32,41,37,46]} icon={<PiggyBank size={19}/>}/>
      <MetricCard title="Mayor categoría" value={largest?.name ?? '—'} detail={largest ? formatMoney(largest.value) : ''} trend={[14,19,17,25,22,31,28,35,30,38]} tone="orange" icon={<BarChart3 size={19}/>}/>
      <MetricCard title="Días bajo el promedio" value="7 días" detail="De 10 días en el periodo" trend={[12,19,14,25,18,31,20,27,22,29]} tone="violet" icon={<CalendarDays size={19}/>}/>
      <MetricCard title="Proyección fin de mes" value={formatMoney(summary.expenses * 1.18)} detail="Estimado al 31 de julio" trend={[18,22,21,29,27,36,34,43,41,52]} tone="violet" icon={<Target size={19}/>}/>
    </div>
    <div className="grid gap-4 xl:grid-cols-[1.15fr_1fr_.6fr]">
      <AppCard className="p-5"><h2 className="font-bold">Evolución de ingresos y gastos</h2><div className="mt-4 h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={evolution}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="day"/><YAxis/><Tooltip/><Legend/><Area type="monotone" dataKey="income" name="Ingresos" stroke="#15803d" fill="#15803d" fillOpacity={0.12}/><Area type="monotone" dataKey="expense" name="Gastos" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.1}/></AreaChart></ResponsiveContainer></div></AppCard>
      <AppCard className="p-5"><h2 className="font-bold">Gastos por categoría</h2><div className="relative h-72"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" cy="42%" innerRadius="45%" outerRadius="70%">{data.map((item,index) => <Cell key={item.name} fill={colors[index%colors.length]}/>)}</Pie><Tooltip formatter={(value) => formatMoney(Number(value))}/><Legend/></PieChart></ResponsiveContainer><div className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 text-center"><strong className="block text-lg text-slate-950">{formatMoney(summary.expenses)}</strong><span className="text-[11px] text-slate-500">Total gastado</span></div></div></AppCard>
      <AppCard className="bg-gradient-to-br from-emerald-50 to-lime-50 p-5"><span className="text-xs font-bold uppercase tracking-wide text-emerald-700">Insight destacado</span><h2 className="mt-5 text-lg font-bold text-emerald-950">Gastaste un 18% más en comida que el mes anterior.</h2><p className="mt-4 text-sm leading-6 text-emerald-900/70">Revisar las compras de fin de semana puede ayudarte a entender el cambio.</p></AppCard>
    </div>
    <div className="grid gap-4 lg:grid-cols-2"><AppCard className="p-5"><h2 className="font-bold">Distribución por día</h2><div className="mt-4 h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={week}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="day"/><YAxis/><Tooltip/><Bar dataKey="value" fill="#7c3aed" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div></AppCard><AppCard className="p-5"><h2 className="font-bold">Recomendaciones prudentes</h2><div className="mt-4 space-y-3">{['Planifica tus compras antes de ir al supermercado.','Revisa los servicios recurrentes que ya no utilizas.','Mantén tus movimientos confirmados para obtener mejores comparaciones.'].map((text) => <p key={text} className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">{text}</p>)}</div><p className="mt-4 text-xs text-slate-400">Información educativa basada en tus registros; no constituye asesoría de inversión.</p></AppCard></div>
  </div>;
}
