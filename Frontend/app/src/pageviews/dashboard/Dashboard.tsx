import { StatsCard } from './components/StatsCard';
import { RevenueChart } from './components/RevenueChart';

interface DashboardProps {
  dict: any;
}

export function Dashboard({ dict }: DashboardProps) {
  return (
    <div className="flex-1 p-8 bg-slate-950 text-slate-100 flex flex-col gap-8 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">{dict.dashboard.title}</h1>
        <p className="text-sm text-slate-400 mt-1">{dict.dashboard.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title={dict.dashboard.stats.balance} 
          value="$12,450.00" 
          change="+12.5%" 
        />
        <StatsCard 
          title={dict.dashboard.stats.expenses} 
          value="$4,210.00" 
          change="-4.2%" 
          isPositive={false}
        />
        <StatsCard 
          title={dict.dashboard.stats.savings} 
          value="$8,240.00" 
          change="+8.1%" 
        />
      </div>

      <RevenueChart dict={dict} />
    </div>
  );
}
