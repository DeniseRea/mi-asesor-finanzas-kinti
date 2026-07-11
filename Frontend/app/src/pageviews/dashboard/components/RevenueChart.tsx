interface RevenueChartProps {
  dict: any;
}

export function RevenueChart({ dict }: RevenueChartProps) {
  // Simulación de gráfico simplificado en Tailwind
  const data = [40, 60, 45, 80, 55, 95];

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col gap-4">
      <span className="text-sm font-semibold text-slate-300">{dict.dashboard.revenue}</span>
      <div className="h-32 flex items-end gap-3 pt-4">
        {data.map((height, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div 
              style={{ height: `${height}%` }}
              className="w-full bg-indigo-600/30 hover:bg-indigo-500 rounded-t transition-all duration-300 relative group"
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-[10px] text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                ${height * 10}
              </div>
            </div>
            <span className="text-[10px] text-slate-500">M{i+1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
