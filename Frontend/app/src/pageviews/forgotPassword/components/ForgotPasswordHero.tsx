import type { ForgotPasswordDictionary } from '@/shared/i18n/dictionaries/forgotPassword';

interface ForgotPasswordHeroProps {
  hero: ForgotPasswordDictionary['hero'];
}

export function ForgotPasswordHero({ hero }: ForgotPasswordHeroProps) {
  return (
    <aside className="auth-hero-enter pointer-events-none absolute bottom-[12%] left-[29%] top-[16%] right-176 z-0 hidden min-[1500px]:flex min-[1500px]:items-center min-[1500px]:justify-center">
      <div className="w-full max-w-xl text-center text-[#0b4937] drop-shadow-[0_2px_14px_rgba(255,255,255,0.95)]">
        <span className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#c7d39b] bg-[#fffaf0]/85 text-[#075b40] shadow-[0_10px_35px_rgba(22,76,55,0.12)] backdrop-blur-sm">
          <svg aria-hidden="true" viewBox="0 0 32 32" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="7" width="24" height="18" rx="3" /><path d="m5 10 11 8 11-8" /><path d="M22 5v5m-2.5-2.5h5" />
          </svg>
        </span>
        <h1 className="text-[clamp(2.25rem,2.8vw,3.4rem)] font-bold leading-[1.05] tracking-[-0.04em]">
          <span className="block">{hero.lineOne}</span>
          <span className="block">{hero.lineTwoPrefix} <span className="text-[#4b9b50]">{hero.lineTwoAccent}</span></span>
        </h1>
        <div className="mx-auto my-5 flex w-36 items-center gap-3 text-[#69a752]"><span className="h-px flex-1 bg-current opacity-70" /><svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 19c-1-6 1-11 7-14 1 7-1 12-7 14Zm-1 0C5 17 3 13 4 7c6 2 8 6 7 12Z" /></svg><span className="h-px flex-1 bg-current opacity-70" /></div>
        <p className="whitespace-pre-line text-base font-medium leading-relaxed text-[#234f42]">{hero.description}</p>
      </div>
    </aside>
  );
}
