import { Button } from '@shared/components/Button';

interface HeroProps {
  dict: any;
}

export function Hero({ dict }: HeroProps) {
  return (
    <section className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-3xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-sm font-medium mb-6">
        ✨ {dict.home.subtitle}
      </div>
      
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent mb-6">
        {dict.home.title}
      </h1>
      
      <p className="text-lg text-slate-400 mb-8 leading-relaxed">
        {dict.home.description}
      </p>

      <div className="flex gap-4">
        <Button variant="primary">{dict.home.startFree}</Button>
        <Button variant="secondary">{dict.home.viewDemo}</Button>
      </div>
    </section>
  );
}
