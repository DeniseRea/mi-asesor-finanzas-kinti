'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Globe2, Menu, Moon, Plus, Search, Sun } from 'lucide-react';
import { useFinance } from '@/entities/finance/model/FinanceProvider';

export function Topbar({ locale, onMenu, onNotifications }: { locale: 'es' | 'en'; onMenu: () => void; onNotifications: () => void }) {
  const { notifications, preferences, dispatch } = useFinance();
  const pathname = usePathname();
  const isHome = pathname === `/${locale}/dashboard`;
  const section = pathname.split('/')[3] ?? '';
  const detail = pathname.split('/')[4] ?? '';
  const headings: Record<string, { title: string; subtitle: string }> = {
    movimientos: detail === 'nueva' ? { title: 'Registrar transacción', subtitle: 'Elige cómo deseas registrar tu ingreso o gasto.' } : detail === 'importar' ? { title: 'Importar movimientos', subtitle: 'Agrega movimientos desde un archivo CSV de tu banco.' } : { title: 'Movimientos', subtitle: 'Consulta todos tus ingresos y gastos en un solo lugar.' },
    presupuestos: { title: 'Presupuestos', subtitle: 'Define tus límites mensuales por categoría y controla tus gastos.' },
    insights: { title: 'Insights', subtitle: 'Descubre patrones y mejora tus hábitos financieros.' },
    asistente: { title: 'Asistente', subtitle: 'Pregunta, registra y resuelve.' },
    soporte: { title: 'Soporte', subtitle: 'Encuentra respuestas o contacta a nuestro equipo.' },
    configuracion: { title: 'Configuración', subtitle: 'Personaliza tu experiencia en Kinti y administra tu cuenta.' },
    'completar-perfil': { title: 'Completa tu perfil', subtitle: 'Deja listas tus preferencias principales.' },
  };
  const heading = isHome ? { title: locale === 'es' ? '¡Hola, María! 👋' : 'Hello, María! 👋', subtitle: locale === 'es' ? 'Miércoles, 10 de julio' : 'Wednesday, July 10' } : headings[section] ?? { title: 'Kinti', subtitle: '' };
  const isBudgetPage = section === 'presupuestos' && !detail;
  const showTransactionAction = isHome || (section === 'movimientos' && !detail);
  const unread = notifications.filter((item) => !item.read).length;
  return <header className="z-30 flex h-16 shrink-0 items-center gap-2 bg-[#f7f9f8] px-3 dark:bg-slate-950 sm:px-5 lg:grid lg:h-24 lg:grid-cols-[minmax(16rem,1fr)_minmax(18rem,28rem)_auto] lg:gap-6 lg:px-7">
    <button onClick={onMenu} className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Abrir menú"><Menu size={21}/></button>
    <div className="min-w-0 flex-1 lg:block"><h1 className="truncate text-base font-extrabold tracking-tight text-slate-950 lg:text-[clamp(1.35rem,1.8vw,1.9rem)]">{heading.title}</h1><p className="mt-1 hidden truncate text-sm text-slate-500 lg:block">{heading.subtitle}</p></div>
    <div className="relative hidden w-full lg:block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/><input aria-label="Buscar" placeholder={locale === 'es' ? 'Buscar algo...' : 'Search...'} className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-emerald-500"/></div>
    <div className="ml-auto flex items-center gap-1.5 sm:gap-2 lg:ml-0 lg:justify-self-end">
      <Link href={locale === 'es' ? '/en/dashboard' : '/es/dashboard'} className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50" aria-label="Cambiar idioma"><Globe2 size={18}/></Link>
      <button onClick={() => dispatch({ type: 'updatePreferences', payload: { darkMode: !preferences.darkMode } })} className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50" aria-label="Cambiar tema">{preferences.darkMode ? <Sun size={18}/> : <Moon size={18}/>}</button>
      <button onClick={onNotifications} className="relative grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50" aria-label="Notificaciones"><Bell size={18}/>{unread > 0 && <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-rose-500 text-[10px] font-bold text-white">{unread}</span>}</button>
      {showTransactionAction && <Link href={`/${locale}/dashboard/movimientos/nueva`} className="ml-1 flex h-10 items-center gap-2 rounded-xl bg-emerald-800 px-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-900 sm:px-4"><Plus size={18}/><span className="hidden sm:inline">{locale === 'es' ? 'Nueva transacción' : 'New transaction'}</span></Link>}
      {isBudgetPage && <button onClick={() => window.dispatchEvent(new Event('kinti:new-budget'))} className="ml-1 flex h-10 items-center gap-2 rounded-xl bg-emerald-800 px-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-900 sm:px-4"><Plus size={18}/><span className="hidden sm:inline">Nuevo presupuesto</span></button>}
    </div>
  </header>;
}
