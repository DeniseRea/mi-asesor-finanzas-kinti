'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, X } from 'lucide-react';
import { useAuth } from '@/shared/lib/auth-context';
import { navItems } from '@/widgets/AppShell/components/nav-items';

export function Sidebar({ currentLocale, open = false, onCloseAction: onClose }: { currentLocale: 'es' | 'en'; open?: boolean; onCloseAction?: () => void }) {
  const { user, logout } = useAuth(); const pathname = usePathname();
  const handleLogout = () => {
    const homeHref = `/${currentLocale}`;
    const loginHref = `/${currentLocale}/login`;
    window.history.replaceState({ ...window.history.state }, '', homeHref);
    void logout();
    window.location.assign(loginHref);
  };
  return <aside className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-[17rem] flex-col overflow-hidden bg-linear-to-b from-[#063f31] to-[#002d25] p-4 text-white shadow-2xl transition-transform duration-300 lg:relative lg:inset-auto lg:w-[clamp(14rem,17vw,17rem)] lg:shrink-0 lg:translate-x-0 lg:shadow-none ${open ? 'translate-x-0' : '-translate-x-full'}`}>
    <div className="mb-7 flex items-center justify-between px-2"><Link href={`/${currentLocale}/dashboard`} className="flex items-center gap-2"><Image src="/assets/brand/kinti-bird.png" alt="Kinti" width={42} height={34} className="object-contain"/><span className="text-2xl font-black tracking-tight">kinti</span></Link><button onClick={onClose} className="rounded-lg p-2 hover:bg-white/10 lg:hidden" aria-label="Cerrar menú"><X size={20}/></button></div>
    <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">{navItems.map((item) => { const href = `/${currentLocale}/dashboard${item.href}`; const active = item.href ? pathname.startsWith(href) : pathname === href; const Icon = item.icon; return <Link onClick={onClose} key={item.key} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${active ? 'bg-emerald-500/25 text-white ring-1 ring-inset ring-emerald-300/10' : 'text-emerald-50/80 hover:bg-white/8 hover:text-white'}`}><Icon size={20}/>{item.label[currentLocale]}{item.key === 'assistant' && <span className="ml-auto rounded-full bg-violet-600 px-2 py-0.5 text-[10px]">Nuevo</span>}</Link>; })}</nav>
    <div className="mt-3 shrink-0 rounded-2xl bg-emerald-500/12 p-4 ring-1 ring-inset ring-white/8"><div className="flex items-center gap-3"><Image src="/assets/app/telegram.svg" alt="Telegram" width={28} height={28}/><div><p className="text-xs font-bold">Conecta tu Telegram</p><p className="mt-1 text-[11px] leading-4 text-emerald-50/65">Registra y consulta tus movimientos desde el bot.</p></div></div></div>
    <div className="mt-3 flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 p-3"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-100 font-bold text-emerald-800">{user?.name?.[0]?.toUpperCase() ?? 'M'}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{user?.name ?? 'María López'}</p><p className="truncate text-[11px] text-emerald-50/60">Cuenta personal</p></div><button onClick={handleLogout} aria-label="Cerrar sesión" className="rounded-lg p-2 text-emerald-50/70 hover:bg-white/10 hover:text-white"><LogOut size={17}/></button></div>
  </aside>;
}
