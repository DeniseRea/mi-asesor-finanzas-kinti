'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/shared/i18n/config';
import type { ForgotPasswordDictionary } from '@/shared/i18n/dictionaries/forgotPassword';
import { isValidEmail, MAX_EMAIL_LENGTH, normalizeEmail } from '../lib/validation';

interface ForgotPasswordFormProps {
  dict: ForgotPasswordDictionary;
  locale: Locale;
}

export function ForgotPasswordForm({ dict, locale }: ForgotPasswordFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  const handleEmailSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem('recovery-email') as HTMLInputElement;
    const normalized = normalizeEmail(email);
    input.setCustomValidity(isValidEmail(normalized) ? '' : dict.validation.email);
    if (!event.currentTarget.reportValidity()) return;
    setEmail(normalized);
    setStep('code');
  };

  const handleCodeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem('verification-code') as HTMLInputElement;
    input.setCustomValidity(/^\d{6}$/.test(code) ? '' : dict.validation.code);
    if (!event.currentTarget.reportValidity()) return;
    router.push(`/${locale}/reset-password`);
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.85rem]">{step === 'email' ? dict.title : dict.codeTitle}</h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500 sm:text-base">
          {step === 'email' ? dict.subtitle : <>{dict.codeSubtitle} <strong className="font-semibold text-slate-700">{email}</strong>.</>}
        </p>
      </div>

      {step === 'email' ? (
        <form onSubmit={handleEmailSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="recovery-email" className="block text-sm font-semibold text-slate-900 sm:text-base">{dict.email}</label>
            <div className="relative">
              <svg aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-9 5.7a2 2 0 0 1-2 0L2 7" /></svg>
              <input id="recovery-email" name="recovery-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} onBlur={() => setEmail((value) => normalizeEmail(value))} onInput={(event) => event.currentTarget.setCustomValidity('')} placeholder={dict.emailPlaceholder} required maxLength={MAX_EMAIL_LENGTH} className="min-h-14 w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-12 pr-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#08704d] focus:ring-3 focus:ring-emerald-700/10" />
            </div>
          </div>
          <button type="submit" className="relative flex min-h-14 w-full items-center justify-center rounded-xl bg-[#075b40] px-5 text-base font-semibold text-white shadow-[0_8px_20px_rgba(7,91,64,0.2)] transition hover:bg-[#064c36] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075b40]">{dict.sendCode}<svg aria-hidden="true" className="absolute right-5 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg></button>
        </form>
      ) : (
        <form onSubmit={handleCodeSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="verification-code" className="block text-sm font-semibold text-slate-900 sm:text-base">{dict.code}</label>
            <input id="verification-code" name="verification-code" type="text" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} onInput={(event) => event.currentTarget.setCustomValidity('')} placeholder={dict.codePlaceholder} required minLength={6} maxLength={6} pattern="[0-9]{6}" className="min-h-16 w-full rounded-xl border border-slate-300 bg-white px-5 text-center text-2xl font-bold tracking-[0.55em] text-slate-900 outline-none transition placeholder:text-slate-300 hover:border-slate-400 focus:border-[#08704d] focus:ring-3 focus:ring-emerald-700/10" />
          </div>
          <button type="submit" className="relative flex min-h-14 w-full items-center justify-center rounded-xl bg-[#075b40] px-5 text-base font-semibold text-white shadow-[0_8px_20px_rgba(7,91,64,0.2)] transition hover:bg-[#064c36] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075b40]">{dict.verifyCode}<svg aria-hidden="true" className="absolute right-5 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg></button>
          <div className="flex items-center justify-center gap-5 text-sm font-semibold">
            <button type="button" onClick={() => setCode('')} className="text-[#08704d] hover:underline">{dict.resendCode}</button>
            <button type="button" onClick={() => { setStep('email'); setCode(''); }} className="text-slate-500 hover:text-slate-800 hover:underline">{dict.changeEmail}</button>
          </div>
        </form>
      )}

      <p className="mt-9 text-center text-sm font-medium text-slate-600 sm:text-base">{dict.rememberedPassword}{' '}<Link href={`/${locale}/login`} className="font-bold text-[#08704d] hover:underline">{dict.signIn}</Link></p>
    </div>
  );
}
