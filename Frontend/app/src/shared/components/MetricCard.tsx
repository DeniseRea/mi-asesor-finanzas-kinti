'use client';

import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { AppCard } from './AppCard';

export function MetricCard({ title, value, detail, icon, tone = 'green', trend, progress }: { title: string; value: string; detail?: string; icon: React.ReactNode; tone?: 'green' | 'red' | 'violet' | 'orange'; trend?: number[]; progress?: number }) {
  const tones = { green: { icon: 'bg-emerald-50 text-emerald-700', stroke: '#15803d', fill: '#dcfce7' }, red: { icon: 'bg-rose-50 text-rose-600', stroke: '#f43f5e', fill: '#ffe4e6' }, violet: { icon: 'bg-violet-50 text-violet-600', stroke: '#7c3aed', fill: '#ede9fe' }, orange: { icon: 'bg-orange-50 text-orange-600', stroke: '#f59e0b', fill: '#ffedd5' } };
  const palette = tones[tone]; const chartData = trend?.map((point, index) => ({ index, point }));
  return <AppCard className="min-w-0 overflow-hidden p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-xs font-semibold text-slate-500 sm:text-sm">{title}</p><p className="mt-2 truncate text-[clamp(1.35rem,2vw,1.75rem)] font-extrabold text-slate-950">{value}</p>{detail && <p className="mt-2 text-xs text-slate-500">{detail}</p>}</div><span className={`grid size-10 shrink-0 place-items-center rounded-full ${palette.icon}`}>{icon}</span></div>{chartData && <div className="-mx-2 mt-3 h-10"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><Area type="monotone" dataKey="point" stroke={palette.stroke} strokeWidth={2} fill={palette.fill} dot={false} isAnimationActive={false}/></AreaChart></ResponsiveContainer></div>}{progress !== undefined && <div className="mt-5"><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full" style={{ width: `${Math.min(100, Math.max(0, progress))}%`, backgroundColor: palette.stroke }}/></div><p className="mt-2 text-right text-xs font-semibold text-slate-500">{Math.round(100-progress)}% restante</p></div>}</AppCard>;
}
