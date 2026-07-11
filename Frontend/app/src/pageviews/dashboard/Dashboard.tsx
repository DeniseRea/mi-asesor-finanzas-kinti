import { StatsCard } from './components/StatsCard';
import { RevenueChart } from './components/RevenueChart';
import type { DashboardDictionary } from '@/shared/i18n/dictionaries/dashboard';

interface DashboardProps {
  dict: DashboardDictionary;
}

export function Dashboard({ dict }: DashboardProps) {
  return (
    <div className="flex-1 p-8 bg-slate-950 text-slate-100 flex flex-col gap-8 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">{dict.title}</h1>
        <p className="text-sm text-slate-400 mt-1">{dict.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title={dict.stats.balance} 
          value="$12,450.00" 
          change="+12.5%" 
        />
        <StatsCard 
          title={dict.stats.expenses} 
          value="$4,210.00" 
          change="-4.2%" 
          isPositive={false}
        />
        <StatsCard 
          title={dict.stats.savings} 
          value="$8,240.00" 
          change="+8.1%" 
        />
      </div>

      <RevenueChart dict={dict} />
    </div>
  );
}
