import { clsx } from 'clsx';

export function AppCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={clsx('rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.035)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20', className)}>{children}</section>;
}
