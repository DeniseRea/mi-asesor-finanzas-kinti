import { Hero } from './components/Hero';

interface HomeProps {
  dict: any;
}

export function Home({ dict }: HomeProps) {
  return (
    <div className="flex-1 flex flex-col justify-center bg-slate-950 min-h-screen text-slate-100">
      <Hero dict={dict} />
    </div>
  );
}
