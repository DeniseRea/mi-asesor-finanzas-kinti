'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  useEffect(() => { const close = (event: KeyboardEvent) => event.key === 'Escape' && onClose(); window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close); }, [onClose]);
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/35 p-0 backdrop-blur-[2px] sm:items-center sm:p-5" onMouseDown={onClose}>
    <div role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()} className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl dark:bg-slate-900 sm:max-w-xl sm:rounded-3xl sm:p-7">
      <div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-bold text-slate-950">{title}</h2><button aria-label="Cerrar" onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><X size={20}/></button></div>{children}
    </div>
  </div>;
}
