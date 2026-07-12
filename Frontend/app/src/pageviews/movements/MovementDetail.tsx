'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Landmark, Tag, Trash2 } from 'lucide-react';
import { useFinance } from '@/entities/finance/model/FinanceProvider';
import { AppCard } from '@/shared/components/AppCard';

export function MovementDetail({ id, locale }: { id: string; locale: 'es' | 'en' }) {
  const { transactions, dispatch, formatMoney } = useFinance(); const router = useRouter(); const item = transactions.find((transaction) => transaction.id === id);
  if (!item) return <AppCard className="p-10 text-center"><h1 className="text-xl font-bold">Movimiento no encontrado</h1><button onClick={() => router.back()} className="mt-4 text-emerald-700">Volver</button></AppCard>;
  const remove = () => { if (window.confirm('¿Eliminar este movimiento?')) { dispatch({ type: 'deleteTransaction', payload: id }); router.push(`/${locale}/dashboard/movimientos`); } };
  return <div className="mx-auto max-w-3xl"><button onClick={() => router.back()} className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-600"><ArrowLeft size={17}/>Volver</button><AppCard className="overflow-hidden"><div className={`p-7 text-center ${item.type === 'income' ? 'bg-emerald-50' : 'bg-slate-50'}`}><p className="text-sm text-slate-500">{item.type === 'income' ? 'Ingreso' : 'Gasto'}</p><h1 className={`mt-2 text-4xl font-black ${item.type === 'income' ? 'text-emerald-700' : 'text-slate-950'}`}>{item.type === 'income' ? '+' : '-'}{formatMoney(item.amount)}</h1><p className="mt-3 text-xl font-bold">{item.merchant}</p></div><div className="grid gap-4 p-6 sm:grid-cols-2">{[[Tag,'Categoría',item.category],[Calendar,'Fecha',new Date(item.date).toLocaleString('es-EC')],[Landmark,'Origen',item.origin],[Tag,'Descripción',item.description]].map(([Icon,label,value]) => { const ItemIcon = Icon as typeof Tag; return <div key={String(label)} className="flex gap-3 rounded-xl border border-slate-100 p-4"><ItemIcon className="text-emerald-700" size={19}/><span><span className="block text-slate-500">{String(label)}</span><strong className="text-sm">{String(value)}</strong></span></div>; })}</div><div className="flex justify-end border-t border-slate-100 p-5"><button onClick={remove} className="flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2 text-sm font-bold text-rose-600"><Trash2 size={17}/>Eliminar</button></div></AppCard></div>;
}
