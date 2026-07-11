'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/shared/i18n/config';
import type { LoginDictionary } from '@/shared/i18n/dictionaries/login';
import { isStrongPassword, isValidEmail, MAX_EMAIL_LENGTH, MAX_PASSWORD_LENGTH, normalizeEmail } from '../lib/validation';

interface LoginFormProps {
  dict: LoginDictionary;
  locale: Locale;
}

export function LoginForm({ dict, locale }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const emailInput = event.currentTarget.elements.namedItem('email') as HTMLInputElement;
    const passwordInput = event.currentTarget.elements.namedItem('password') as HTMLInputElement;

    emailInput.setCustomValidity(isValidEmail(email) ? '' : dict.validation.email);
    passwordInput.setCustomValidity(isStrongPassword(password) ? '' : dict.validation.password);
    event.currentTarget.reportValidity();
  };

  return (
    <div className="mx-auto flex w-full max-w-[31rem] flex-col items-center">
      <div className="mb-8 flex items-center gap-3 sm:mb-10">
        <Image
          src="/assets/login/kinti-bird.png"
          alt=""
          width={58}
          height={58}
          sizes="58px"
          className="h-[52px] w-[52px] object-contain sm:h-[58px] sm:w-[58px]"
        />
        <span className="text-[2.4rem] font-bold leading-none tracking-[-0.04em] text-[#083b2c] sm:text-[2.75rem]">
          {dict.brandName}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-5">
        <div className="space-y-2">
          <label htmlFor="login-email" className="block text-sm font-semibold text-slate-900 sm:text-base">
            {dict.email}
          </label>
          <div className="relative">
            <svg aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={() => setEmail((value) => normalizeEmail(value))}
              onInput={(event) => event.currentTarget.setCustomValidity('')}
              placeholder={dict.emailPlaceholder}
              className="min-h-14 w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-12 pr-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#08704d] focus:ring-3 focus:ring-emerald-700/10"
              required
              maxLength={MAX_EMAIL_LENGTH}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="login-password" className="block text-sm font-semibold text-slate-900 sm:text-base">
            {dict.password}
          </label>
          <div className="relative">
            <svg aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onInput={(event) => event.currentTarget.setCustomValidity('')}
              placeholder="••••••••••••"
              className="min-h-14 w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-12 pr-12 text-base text-slate-900 outline-none transition placeholder:text-slate-500 hover:border-slate-400 focus:border-[#08704d] focus:ring-3 focus:ring-emerald-700/10"
              required
              minLength={8}
              maxLength={MAX_PASSWORD_LENGTH}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? dict.hidePassword : dict.showPassword}
              aria-pressed={showPassword}
              className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-[#075b40]"
            >
              {showPassword ? (
                <svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" />
                </svg>
              ) : (
                <svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          <div className="pt-1 text-right">
            <Link href={`/${locale}/forgot-password`} className="text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              {dict.forgotPassword}
            </Link>
          </div>
        </div>

        <button
          id="login-submit"
          type="submit"
          className="relative flex min-h-14 w-full items-center justify-center rounded-xl bg-[#075b40] px-5 text-base font-semibold text-white shadow-[0_8px_20px_rgba(7,91,64,0.2)] transition hover:bg-[#064c36] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075b40]"
        >
          <span>{dict.submit}</span>
          <svg aria-hidden="true" className="absolute right-5" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14m-7-7 7 7-7 7" />
          </svg>
        </button>
      </form>

      <div className="my-6 flex w-full items-center gap-4">
        <span aria-hidden="true" className="h-px flex-1 bg-slate-200" />
        <span className="text-sm font-medium text-slate-500">
          {dict.continueWith}
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-slate-200" />
      </div>

      <button
        id="login-google"
        type="button"
        aria-label={`${dict.continueWithProvider} ${dict.google}`}
        className="flex min-h-14 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-base font-semibold text-slate-800 shadow-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075b40]"
      >
        <Image src="/assets/login/google-g.svg" alt="" width={23} height={23} />
        <span>{dict.google}</span>
      </button>

      <p className="mt-7 text-center text-sm font-medium text-slate-600 sm:text-base">
        {dict.noAccount}{' '}
        <Link href={`/${locale}/register`} className="font-bold text-[#08704d] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075b40]">
          {dict.createAccount}
        </Link>
      </p>
    </div>
  );
}
