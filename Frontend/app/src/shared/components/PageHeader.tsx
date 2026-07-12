export function PageHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return <header className="hidden" aria-hidden="true">
    <div><h1 className="text-[clamp(1.65rem,2.4vw,2.25rem)] font-extrabold tracking-tight text-slate-950">{title}</h1><p className="mt-1 text-sm text-slate-500 sm:text-base">{subtitle}</p></div>
    {action}
  </header>;
}
