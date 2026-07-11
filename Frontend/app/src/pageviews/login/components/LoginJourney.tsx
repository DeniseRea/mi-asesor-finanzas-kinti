import type { LoginDictionary } from '@/shared/i18n/dictionaries/login';

interface LoginJourneyProps {
  journey: LoginDictionary['journey'];
}

interface JourneyStepProps {
  className: string;
  label: string;
  icon: 'chart' | 'control' | 'growth';
  delay: string;
}

function JourneyIcon({ icon }: Pick<JourneyStepProps, 'icon'>) {
  if (icon === 'chart') {
    return (
      <svg aria-hidden="true" viewBox="0 0 32 32" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 26h22M8 24v-7h5v7m2 0V11h5v13m2 0V5h5v19" />
        <path d="m7 14 5-4 5 2 8-8" opacity=".55" />
      </svg>
    );
  }

  if (icon === 'control') {
    return (
      <svg aria-hidden="true" viewBox="0 0 32 32" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4v12h12A12 12 0 1 1 16 4Z" />
        <path d="M20 3.5A10.5 10.5 0 0 1 28.5 12H20Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 28V15" />
      <path d="M16 18C7 18 5 11 5 5c7 0 12 4 11 13Zm0 3c9 0 12-7 11-14-7 1-11 6-11 14Z" />
      <path d="m10 10 6 8m7-6-7 9" opacity=".55" />
    </svg>
  );
}

function JourneyStep({ className, label, icon, delay }: JourneyStepProps) {
  return (
    <div style={{ '--journey-delay': delay } as React.CSSProperties} className={`journey-step absolute flex w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 text-[#174c39] ${className}`}>
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#b9c98d] bg-[#fffdf5]/90 text-[#5e9c3f] shadow-[0_7px_24px_rgba(29,83,57,0.12)] backdrop-blur-sm">
        <JourneyIcon icon={icon} />
      </span>
      <span className="text-xs font-semibold tracking-wide drop-shadow-[0_1px_5px_rgba(255,255,255,0.9)]">
        {label}
      </span>
    </div>
  );
}

export function LoginJourney({ journey }: LoginJourneyProps) {
  return (
    <aside className="auth-hero-enter pointer-events-none absolute bottom-[8%] left-[25%] top-[8%] right-176 z-0 hidden min-[1500px]:block" aria-label={`${journey.lineOne} ${journey.lineTwo}`}>
      <svg aria-hidden="true" viewBox="0 0 720 850" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id="journey-line-gradient" x1="0" y1="850" x2="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#eadbc0" />
            <stop offset="16%" stopColor="#4e9f4a" />
            <stop offset="82%" stopColor="#4e9f4a" />
            <stop offset="100%" stopColor="#eadbc0" />
          </linearGradient>
        </defs>
        <path
          className="journey-line"
          d="M122 155C220 108 486 102 596 120c93 42 80 145 5 217-48 46-56 105-10 150 60 58 55 132-35 178-102 52-260 48-433 151"
          fill="none"
          stroke="url(#journey-line-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity=".72"
        />
        <path d="M29 155l15-3-9 13Z" fill="#75a95d" opacity=".8" />
        <circle cx="248" cy="105" r="4" fill="#7ead4b" />
        <circle cx="614" cy="273" r="4" fill="#7ead4b" />
        <circle cx="402" cy="724" r="3.5" fill="#7ead4b" />
      </svg>

      <JourneyStep className="left-[82.8%] top-[14.1%]" label={journey.know} icon="chart" delay="760ms" />
      <JourneyStep className="left-[82.1%] top-[57.3%]" label={journey.control} icon="control" delay="1.18s" />
      <JourneyStep className="left-[55.5%] top-[85.2%]" label={journey.improve} icon="growth" delay="1.62s" />

      <div className="absolute left-[9%] top-[35%] w-[67%] text-center text-[#0b4937] drop-shadow-[0_2px_12px_rgba(255,255,255,0.95)]">
        <h1 className="text-[clamp(2.25rem,3.1vw,3.8rem)] font-bold leading-[1.02] tracking-[-0.04em]">
          <span className="block">{journey.lineOne}</span>
          <span className="block text-[#2d7c55]">{journey.lineTwo}</span>
        </h1>
        <div className="mx-auto my-5 flex w-32 items-center gap-3 text-[#69a752]">
          <span className="h-px flex-1 bg-current opacity-60" />
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M12 19c-1-6 1-11 7-14 1 7-1 12-7 14Zm-1 0C5 17 3 13 4 7c6 2 8 6 7 12Z" />
          </svg>
          <span className="h-px flex-1 bg-current opacity-60" />
        </div>
        <p className="whitespace-pre-line text-sm font-medium leading-relaxed text-[#234f42] min-[1700px]:text-base">
          {journey.description}
        </p>
      </div>
    </aside>
  );
}
