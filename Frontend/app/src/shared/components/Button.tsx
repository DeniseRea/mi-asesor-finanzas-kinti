import { type ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'px-8 py-3 rounded-lg font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]',
        {
          'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30': variant === 'primary',
          'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300': variant === 'secondary'
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
