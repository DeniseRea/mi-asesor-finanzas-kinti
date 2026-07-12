'use client';

import { useId } from 'react';
import { AppCard } from './AppCard';

function Sparkline({ points, stroke, fill }: { points: number[]; stroke: string; fill: string }) {
  const gradientId = useId().replace(/:/g, '');
  const width = 180; const height = 42; const padding = 3;
  const min = Math.min(...points); const range = Math.max(1, Math.max(...points) - min);
  const coordinates = points.map((point, index) => ({ x: padding + index / Math.max(1, points.length - 1) * (width - padding * 2), y: height - padding - (point - min) / range * (height - padding * 2) }));
  const line = coordinates.map(({ x, y }, index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`).join(' ');
  const area = `${line} L${coordinates.at(-1)?.x ?? width - padding} ${height} L${coordinates[0]?.x ?? padding} ${height} Z`;
  return <svg aria-hidden="true" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-full w-full"><defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={fill} stopOpacity=".9"/><stop offset="1" stopColor={fill} stopOpacity=".08"/></linearGradient></defs><path d={area} fill={`url(#${gradientId})`}/><path d={line} fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export function MetricCard({ title, value, detail, icon, tone = 'green', trend, progress }: { title: string; value: string; detail?: string; icon: React.ReactNode; tone?: 'green' | 'red' | 'violet' | 'orange'; trend?: number[]; progress?: number }) {
  const tones = { green: { icon: 'bg-emerald-50 text-emerald-700', stroke: '#15803d', fill: '#dcfce7' }, red: { icon: 'bg-rose-50 text-rose-600', stroke: '#f43f5e', fill: '#ffe4e6' }, violet: { icon: 'bg-violet-50 text-violet-600', stroke: '#7c3aed', fill: '#ede9fe' }, orange: { icon: 'bg-orange-50 text-orange-600', stroke: '#f59e0b', fill: '#ffedd5' } };
  const palette = tones[tone];
  return <AppCard className="min-w-0 overflow-hidden p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-xs font-semibold text-slate-500 sm:text-sm">{title}</p><p className="mt-2 truncate text-[clamp(1.35rem,2vw,1.75rem)] font-extrabold text-slate-950">{value}</p>{detail && <p className="mt-2 text-xs text-slate-500">{detail}</p>}</div><span className={`grid size-10 shrink-0 place-items-center rounded-full ${palette.icon}`}>{icon}</span></div>{trend && <div className="-mx-2 mt-3 h-10"><Sparkline points={trend} stroke={palette.stroke} fill={palette.fill}/></div>}{progress !== undefined && <div className="mt-5"><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full" style={{ width: `${Math.min(100, Math.max(0, progress))}%`, backgroundColor: palette.stroke }}/></div><p className="mt-2 text-right text-xs font-semibold text-slate-500">{Math.round(100-progress)}% restante</p></div>}</AppCard>;
}
