'use client';

import { UserAvatar } from '@entities/user/components/UserAvatar';
import Link from 'next/link';

interface SidebarProps {
  currentLocale: 'es' | 'en';
}

export function Sidebar({ currentLocale }: SidebarProps) {
  const mockUser = {
    id: '123',
    name: 'Kevin Kinti',
    email: 'kevin@kinti.io',
  };

  return (
    <aside className="w-64 border-r border-slate-900 bg-slate-950 flex flex-col h-screen sticky top-0 p-6 justify-between">
      <div className="flex flex-col gap-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center font-bold text-white">K</div>
          <span className="font-extrabold text-lg tracking-tight text-white">KINTI</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          <Link
            href={`/${currentLocale}/`}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            {currentLocale === 'es' ? 'Inicio' : 'Home'}
          </Link>
          <Link
            href={`/${currentLocale}/dashboard`}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            {currentLocale === 'es' ? 'Panel' : 'Dashboard'}
          </Link>
        </nav>
      </div>

      <div className="flex flex-col gap-6">
        {/* User Info */}
        <UserAvatar user={mockUser} />
        
        {/* Language switch toggle */}
        <div className="flex gap-2">
          <Link 
            href="/es"
            className={`flex-1 text-center py-1.5 rounded-lg text-xs font-semibold border ${currentLocale === 'es' ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400' : 'border-slate-800 text-slate-400 hover:text-white'}`}
          >
            ES
          </Link>
          <Link 
            href="/en"
            className={`flex-1 text-center py-1.5 rounded-lg text-xs font-semibold border ${currentLocale === 'en' ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400' : 'border-slate-800 text-slate-400 hover:text-white'}`}
          >
            EN
          </Link>
        </div>
      </div>
    </aside>
  );
}
