'use client';

import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface CategoryDatum { name: string; value: number; fill: string }

export function CategoryDonut({ data, total, currency }: { data: CategoryDatum[]; total: number; currency: string }) {
  const formatMoney = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  return <div className="relative h-76"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} cy="43%" innerRadius={74} outerRadius={112} paddingAngle={1} dataKey="value"/><Tooltip formatter={(value) => formatMoney(Number(value))}/><Legend iconType="circle" verticalAlign="bottom"/></PieChart></ResponsiveContainer><div className="pointer-events-none absolute left-1/2 top-[43%] -translate-x-1/2 -translate-y-1/2 text-center"><strong className="block text-xl text-slate-950">{formatMoney(total)}</strong><span className="text-xs text-slate-500">Total gastos</span></div></div>;
}
