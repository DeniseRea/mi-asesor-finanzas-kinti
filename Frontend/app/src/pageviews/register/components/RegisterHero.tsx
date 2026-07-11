import type { RegisterDictionary } from '@/shared/i18n/dictionaries/register';

interface RegisterHeroProps {
  brandName: string;
  hero: RegisterDictionary['hero'];
}

export function RegisterHero({ brandName, hero }: RegisterHeroProps) {
  return (
    <aside className="auth-hero-enter pointer-events-none absolute bottom-[12%] left-[29%] top-[18%] right-176 z-0 hidden min-[1500px]:flex min-[1500px]:items-center min-[1500px]:justify-center">
      <div className="w-full max-w-xl text-center text-[#0b4937] drop-shadow-[0_2px_14px_rgba(255,255,255,0.95)]">
        <span className="mb-5 block text-3xl font-bold tracking-[-0.04em] text-[#0a4937]">{brandName}</span>
        <h1 className="text-[clamp(2.3rem,3vw,3.7rem)] font-bold leading-[1.04] tracking-[-0.04em]">
          <span className="block">{hero.lineOne}</span>
          <span className="block">{hero.lineTwoPrefix} <span className="text-[#4b9b50]">{hero.lineTwoAccent}</span></span>
        </h1>
        <div className="mx-auto my-5 flex w-36 items-center gap-3 text-[#69a752]">
          <span className="h-px flex-1 bg-current opacity-70" />
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M12 19c-1-6 1-11 7-14 1 7-1 12-7 14Zm-1 0C5 17 3 13 4 7c6 2 8 6 7 12Z" />
          </svg>
          <span className="h-px flex-1 bg-current opacity-70" />
        </div>
        <p className="whitespace-pre-line text-base font-medium leading-relaxed text-[#234f42]">
          {hero.description}
        </p>
      </div>
    </aside>
  );
}
