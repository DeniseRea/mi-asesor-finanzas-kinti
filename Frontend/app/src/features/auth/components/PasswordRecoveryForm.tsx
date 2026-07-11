'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/shared/i18n/config';
import type { PasswordRecoveryDictionary } from '@/shared/i18n/dictionaries/passwordRecovery';
import { getPasswordStrength, isStrongPassword, MAX_PASSWORD_LENGTH } from '../lib/validation';

interface PasswordRecoveryFormProps {
  dict: PasswordRecoveryDictionary;
  locale: Locale;
}

interface RecoveryPasswordInputProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  visible: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
  dict: PasswordRecoveryDictionary;
}

function RecoveryPasswordInput({ id, label, placeholder, value, visible, onChange, onToggle, dict }: RecoveryPasswordInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-900 sm:text-base">{label}</label>
      <div className="relative">
        <svg aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
        <input id={id} name={id} type={visible ? 'text' : 'password'} value={value} onChange={(event) => onChange(event.target.value)} onInput={(event) => event.currentTarget.setCustomValidity('')} autoComplete="new-password" placeholder={placeholder} minLength={8} maxLength={MAX_PASSWORD_LENGTH} required className="min-h-14 w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-12 pr-12 text-base text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#08704d] focus:ring-3 focus:ring-emerald-700/10" />
        <button type="button" onClick={onToggle} aria-label={visible ? dict.hidePassword : dict.showPassword} aria-pressed={visible} className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#075b40]">
          <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{visible ? <path d="M3 3l18 18M10.6 10.6A2 2 0 0 0 13.4 13.4M9.9 4.2A10 10 0 0 1 12 4c7 0 11 8 11 8a18 18 0 0 1-2.2 3.2M6.1 6.1A18 18 0 0 0 1 12s4 8 11 8a10 10 0 0 0 5.9-2" /> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8Z" /><circle cx="12" cy="12" r="3" /></>}</svg>
        </button>
      </div>
    </div>
  );
}

export function PasswordRecoveryForm({ dict, locale }: PasswordRecoveryFormProps) {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const strength = getPasswordStrength(password);
  const activeSegments = Math.ceil((strength * 4) / 5);
  const strengthLabel = strength === 5 ? dict.strength.strong : strength >= 3 ? dict.strength.medium : dict.strength.weak;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const passwordInput = form.elements.namedItem('recovery-password') as HTMLInputElement;
    const confirmationInput = form.elements.namedItem('recovery-confirmation') as HTMLInputElement;
    passwordInput.setCustomValidity(isStrongPassword(password) ? '' : dict.validation.password);
    confirmationInput.setCustomValidity(password === confirmation ? '' : dict.validation.confirmation);
    form.reportValidity();
  };

  return (
    <div className="w-full">
      <div className="mb-9">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.85rem]">{dict.title}</h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500 sm:text-base">{dict.subtitle}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-7">
        <div>
          <RecoveryPasswordInput id="recovery-password" label={dict.password} placeholder={dict.passwordPlaceholder} value={password} visible={showPassword} onChange={setPassword} onToggle={() => setShowPassword((value) => !value)} dict={dict} />
          <div className="mt-3 flex items-center gap-3" aria-live="polite">
            <div className="grid flex-1 grid-cols-4 gap-1.5">
              {[0, 1, 2, 3].map((segment) => <span key={segment} className={`h-2 rounded-full transition-colors duration-200 ${segment < activeSegments ? (strength === 5 ? 'bg-emerald-600' : strength >= 3 ? 'bg-lime-500' : 'bg-amber-400') : 'bg-slate-200'}`} />)}
            </div>
            <span className={`min-w-14 text-sm font-semibold ${strength === 5 ? 'text-emerald-700' : strength >= 3 ? 'text-lime-700' : 'text-amber-700'}`}>{strengthLabel}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">{dict.passwordHint}</p>
        </div>

        <RecoveryPasswordInput id="recovery-confirmation" label={dict.confirmation} placeholder={dict.confirmationPlaceholder} value={confirmation} visible={showConfirmation} onChange={setConfirmation} onToggle={() => setShowConfirmation((value) => !value)} dict={dict} />

        <button type="submit" className="relative flex min-h-14 w-full items-center justify-center rounded-xl bg-[#075b40] px-5 text-base font-semibold text-white shadow-[0_8px_20px_rgba(7,91,64,0.2)] transition hover:bg-[#064c36] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075b40]">
          {dict.submit}<svg aria-hidden="true" className="absolute right-5 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
        </button>
      </form>
      <p className="mt-8 text-center text-sm font-medium text-slate-600 sm:text-base">{dict.rememberedPassword}{' '}<Link href={`/${locale}/login`} className="font-bold text-[#08704d] hover:underline">{dict.signIn}</Link></p>
    </div>
  );
}
