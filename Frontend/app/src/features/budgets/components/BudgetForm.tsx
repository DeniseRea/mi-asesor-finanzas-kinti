'use client';

import { useState } from 'react';
import { categories } from '@/entities/finance/model/mock-data';
import { useFinance } from '@/entities/finance/model/FinanceProvider';

export function BudgetForm({ onSavedAction: onSaved }: { onSavedAction: () => void }) {
  const { dispatch, budgets } = useFinance(); const available = categories.filter((item) => !budgets.some((budget) => budget.category === item)); const [category, setCategory] = useState(available[0] ?? 'Otros'); const [limit, setLimit] = useState(''); const [threshold, setThreshold] = useState('80'); const [error, setError] = useState('');
  const submit = (event: React.FormEvent) => { event.preventDefault(); const amount = Number(limit); const warning = Number(threshold); if (!amount || amount <= 0 || warning < 1 || warning > 100) { setError('Ingresa un límite válido y un umbral entre 1 y 100.'); return; } dispatch({ type: 'saveBudget', payload: { category, limit: amount, threshold: warning, icon: '◉', color: '#15803d' } }); onSaved(); };
  return <form onSubmit={submit} className="space-y-4"><label className="block text-sm font-semibold">Categoría<select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4">{available.length ? available.map((item) => <option key={item}>{item}</option>) : <option>Otros</option>}</select></label><label className="block text-sm font-semibold">Límite mensual<input value={limit} onChange={(event) => setLimit(event.target.value)} inputMode="decimal" placeholder="500.00" className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4"/></label><label className="block text-sm font-semibold">Avisarme al porcentaje<input value={threshold} onChange={(event) => setThreshold(event.target.value)} type="number" min="1" max="100" className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4"/></label>{error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}<button className="h-12 w-full rounded-xl bg-emerald-800 font-bold text-white">Crear presupuesto</button></form>;
}
