import { Hero } from './components/Hero';
import type { HomeDictionary } from '@/shared/i18n/dictionaries/home';

interface HomeProps {
  dict: HomeDictionary;
}

export function Home({ dict }: HomeProps) {
  return (
    <div className="flex-1 flex flex-col justify-center bg-slate-950 min-h-screen text-slate-100">
      <Hero dict={dict} />
    </div>
  );
}
