'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from './nav-items';

export function MobileNav({ locale }: { locale: 'es' | 'en' }) {
  const pathname = usePathname();
  return <nav className="fixed inset-x-0 bottom-0 z-40 grid h-[4.5rem] grid-cols-5 border-t border-slate-200 bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
    {navItems.slice(0, 5).map((item) => { const href = `/${locale}/dashboard${item.href}`; const active = item.href ? pathname.startsWith(href) : pathname === href; const Icon = item.icon; return <Link key={item.key} href={href} className={`flex min-w-0 flex-col items-center justify-center gap-1 text-[10px] font-semibold ${active ? 'text-emerald-700' : 'text-slate-500'}`}><Icon size={20}/><span className="max-w-full truncate">{item.label[locale]}</span></Link>; })}
  </nav>;
}
