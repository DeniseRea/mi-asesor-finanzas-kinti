'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import type { HomeDictionary } from '@/shared/i18n/dictionaries/home';

export function LandingNav({ dict, locale, onDemoAction }: { dict: HomeDictionary; locale: 'es' | 'en'; onDemoAction: () => void }) {
  const [compact, setCompact] = useState(false); const [open, setOpen] = useState(false);
  useEffect(() => { const update = () => setCompact(window.scrollY > 24); update(); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update); }, []);
  const links = [{ target: 'producto', label: dict.navFeatures },{ target: 'como-funciona', label: dict.navHow },{ target: 'seguridad', label: dict.navSecurity }];
  const goToSection = (target: string) => { document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); setOpen(false); };
  return <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${compact ? 'py-3' : 'py-5'}`}><div className={`mx-auto flex w-[min(94%,86rem)] items-center justify-between rounded-2xl px-4 transition-all duration-500 sm:px-5 ${compact ? 'border border-white/70 bg-white/80 py-2.5 shadow-[0_16px_50px_rgba(8,59,44,.10)] backdrop-blur-xl' : 'py-2'}`}>
    <Link href={`/${locale}`} className="flex items-center gap-2.5"><Image src="/assets/login/kinti-bird.png" alt="Kinti" width={42} height={36} className="h-9 w-11 object-contain"/><span className="text-2xl font-black tracking-[-.04em] text-[#073d2d]">kinti</span></Link>
    <nav className="hidden items-center gap-8 lg:flex">{links.map((item) => <button type="button" key={item.target} onClick={() => goToSection(item.target)} className="text-sm font-semibold text-slate-600 hover:text-emerald-800">{item.label}</button>)}</nav>
    <div className="hidden items-center gap-2 sm:flex"><Link href={`/${locale}/login`} className="rounded-xl px-4 py-2.5 text-sm font-bold text-emerald-900 hover:bg-white/70">{dict.login}</Link><button onClick={onDemoAction} className="flex items-center gap-2 rounded-xl bg-[#075b40] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/10 hover:-translate-y-0.5 hover:bg-[#064c36]">{dict.viewDemo}<ArrowUpRight size={16}/></button></div>
    <button onClick={() => setOpen((value) => !value)} className="rounded-xl p-2 text-emerald-900 sm:hidden" aria-label="Abrir navegación">{open ? <X/> : <Menu/>}</button>
  </div>{open && <div className="mx-auto mt-2 w-[min(92%,30rem)] rounded-2xl border border-emerald-100 bg-white/95 p-3 shadow-xl backdrop-blur-xl sm:hidden">{links.map((item) => <button type="button" onClick={() => goToSection(item.target)} key={item.target} className="block w-full rounded-xl px-4 py-3 text-left font-semibold text-slate-700 hover:bg-emerald-50">{item.label}</button>)}<div className="mt-2 grid grid-cols-2 gap-2"><Link href={`/${locale}/login`} className="rounded-xl border border-emerald-200 px-3 py-3 text-center text-sm font-bold text-emerald-800">{dict.login}</Link><button onClick={onDemoAction} className="rounded-xl bg-emerald-800 px-3 py-3 text-sm font-bold text-white">{dict.viewDemo}</button></div></div>}</header>;
}
