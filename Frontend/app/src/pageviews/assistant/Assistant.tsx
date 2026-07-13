'use client';

import { useRef, useState } from 'react';
import { Bot, Lightbulb, LoaderCircle, Send, Sparkles } from 'lucide-react';
import { useFinance } from '@/entities/finance/model/FinanceProvider';
import { AppCard } from '@/shared/components/AppCard';

export function Assistant() {
  const { messages, summary, budgets, expensesByCategory, formatMoney, sendAssistantMessage, isDemo } = useFinance();
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const sendLock = useRef(false);
  const [error, setError] = useState('');

  const send = async () => {
    const clean = text.trim().slice(0, 300);
    if (!clean || sendLock.current) return;
    sendLock.current = true;
    setText('');
    setError('');
    setIsSending(true);
    try {
      await sendAssistantMessage(clean);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No fue posible procesar el mensaje.');
    } finally {
      sendLock.current = false;
      setIsSending(false);
    }
  };

  const nearLimit = budgets.filter((item) => item.limit > 0 && (expensesByCategory[item.category] ?? 0) / item.limit >= 0.8);

  return (
    <div className="grid gap-4 xl:h-[calc(100dvh-7rem)] xl:min-h-[36rem] xl:grid-cols-[1fr_21rem]">
      <AppCard className="flex h-[calc(100dvh-10rem)] min-h-0 flex-col overflow-hidden xl:h-auto">
        <div className="border-b border-slate-100 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-violet-50 text-violet-700"><Sparkles /></span>
            <div>
              <h1 className="text-2xl font-black">Asistente</h1>
              <p className="text-sm text-slate-500">{isDemo ? 'Modo demo — las respuestas no llegan al backend.' : 'Pregunta, registra y resuelve.'}</p>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.map((item) => (
            <div key={item.id} className={`flex items-start gap-3 ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {item.role === 'assistant' && <span className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-950 text-emerald-300 ring-4 ring-emerald-50"><Bot size={18} /></span>}
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[70%] ${item.role === 'user' ? 'min-w-24 bg-emerald-800 text-white' : 'border border-slate-200 bg-white text-slate-700'}`}>
                {item.text}
                <span className={`mt-1 block text-right ${item.role === 'user' ? 'text-emerald-100' : 'text-slate-400'}`}>{item.createdAt}</span>
              </div>
            </div>
          ))}
          {isSending && <div className="flex items-center gap-2 text-sm text-slate-500"><LoaderCircle className="animate-spin" size={17} /> La IA está procesando tu mensaje…</div>}
          {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
        </div>

        <div className="border-t border-slate-100 p-3">
          <div className="mb-2 hidden gap-2 overflow-x-auto sm:flex">
            {['¿Cuánto tengo disponible?', '¿Cómo van mis presupuestos?', 'Registrar un gasto'].map((suggestion) => (
              <button key={suggestion} onClick={() => setText(suggestion)} className="whitespace-nowrap rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:border-emerald-200 hover:bg-emerald-50">{suggestion}</button>
            ))}
          </div>
          <div className="flex gap-2 rounded-2xl border border-slate-200 p-2">
            <input value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void send(); }} maxLength={300} disabled={isSending} placeholder="Escribe tu mensaje..." className="min-w-0 flex-1 px-2 text-sm outline-none disabled:opacity-60" />
            <button onClick={() => void send()} disabled={isSending || !text.trim()} className="grid size-11 place-items-center rounded-xl bg-emerald-800 text-white disabled:cursor-not-allowed disabled:opacity-50"><Send size={18} /></button>
          </div>
        </div>
      </AppCard>

      <aside className="min-h-0 space-y-4 overflow-y-auto">
        <AppCard className="p-5">
          <h2 className="font-bold">Resumen rápido</h2>
          {[['Saldo actual', summary.balance], ['Ingresos del mes', summary.income], ['Gastos del mes', summary.expenses]].map(([label, value]) => (
            <div key={String(label)} className="mt-4 flex justify-between border-b border-slate-100 pb-3 text-sm"><span className="text-slate-500">{String(label)}</span><strong>{formatMoney(Number(value))}</strong></div>
          ))}
        </AppCard>
        <AppCard className="p-5">
          <h2 className="font-bold">Presupuestos cerca del límite</h2>
          {nearLimit.length === 0 && <p className="mt-3 text-sm text-slate-500">No hay presupuestos cerca del límite.</p>}
          {nearLimit.map((item) => {
            const percentage = Math.min(100, ((expensesByCategory[item.category] ?? 0) / item.limit) * 100);
            return <div key={item.id} className="mt-4"><div className="flex justify-between text-sm"><strong>{item.category}</strong><span>{Math.round(percentage)}%</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-orange-500" style={{ width: `${percentage}%` }} /></div></div>;
          })}
        </AppCard>
        {nearLimit.length > 0 && <AppCard className="bg-linear-to-br from-violet-50 to-blue-50 p-5"><Lightbulb className="text-violet-700" /><h2 className="mt-3 font-bold text-violet-900">Sugerencia para ti</h2><p className="mt-2 text-sm leading-6 text-violet-900/70">Revisa {nearLimit[0].category}: ya consumiste al menos el 80% del presupuesto.</p></AppCard>}
      </aside>
    </div>
  );
}
