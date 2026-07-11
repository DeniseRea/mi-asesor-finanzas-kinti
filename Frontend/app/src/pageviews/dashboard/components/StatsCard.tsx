interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  isPositive?: boolean;
}

export function StatsCard({ title, value, change, isPositive = true }: StatsCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
      <span className="text-sm text-slate-400 font-medium">{title}</span>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className={`text-xs font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {change}
        </span>
      </div>
    </div>
  );
}
