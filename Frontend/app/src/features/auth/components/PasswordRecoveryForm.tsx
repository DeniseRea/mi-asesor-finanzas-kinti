'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/shared/i18n/config';
import type { PasswordRecoveryDictionary } from '@/shared/i18n/dictionaries/passwordRecovery';
import { getPasswordStrength, isStrongPassword, MAX_PASSWORD_LENGTH } from '../lib/validation';
import { apiClient } from '@/shared/api/apiClient';

function PasswordInput({ id, label, placeholder, value, visible, onChange, onToggle, dict }: { id: string; label: string; placeholder: string; value: string; visible: boolean; onChange: (value: string) => void; onToggle: () => void; dict: PasswordRecoveryDictionary }) {
  return <div className="space-y-2"><label htmlFor={id} className="block text-sm font-semibold text-slate-900 sm:text-base">{label}</label><div className="relative"><input id={id} name={id} type={visible ? 'text' : 'password'} value={value} onChange={(event) => onChange(event.target.value)} onInput={(event) => event.currentTarget.setCustomValidity('')} autoComplete="new-password" placeholder={placeholder} minLength={8} maxLength={MAX_PASSWORD_LENGTH} required className="min-h-14 w-full rounded-xl border border-slate-300 bg-white px-4 pr-12 text-base text-slate-900 outline-none focus:border-[#08704d] focus:ring-3 focus:ring-emerald-700/10"/><button type="button" onClick={onToggle} aria-label={visible ? dict.hidePassword : dict.showPassword} aria-pressed={visible} className="absolute right-2 top-1/2 size-10 -translate-y-1/2 rounded-lg text-slate-500 hover:bg-slate-100">{visible ? '◉' : '◎'}</button></div></div>;
}

export function PasswordRecoveryForm({ dict, locale }: { dict: PasswordRecoveryDictionary; locale: Locale }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const strength = getPasswordStrength(password);
  const activeSegments = Math.ceil((strength * 4) / 5);

  useEffect(() => {
    const token = sessionStorage.getItem('kinti_reset_token');
    const email = sessionStorage.getItem('kinti_recovery_email');
    if (token && email) queueMicrotask(() => setAuthorized(true));
    else {
      router.replace(`/${locale}/forgot-password`);
    }
  }, [locale, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const passwordInput = form.elements.namedItem('recovery-password') as HTMLInputElement;
    const confirmationInput = form.elements.namedItem('recovery-confirmation') as HTMLInputElement;
    passwordInput.setCustomValidity(isStrongPassword(password) ? '' : dict.validation.password);
    confirmationInput.setCustomValidity(password === confirmation ? '' : dict.validation.confirmation);
    if (!form.reportValidity()) return;
    setIsSubmitting(true);
    try {
      await apiClient('/api/auth/reset-password', { method: 'POST', body: JSON.stringify({ email: sessionStorage.getItem('kinti_recovery_email'), resetToken: sessionStorage.getItem('kinti_reset_token'), password, confirmPassword: confirmation }) });
      sessionStorage.removeItem('kinti_reset_token'); sessionStorage.removeItem('kinti_recovery_email');
      setPassword(''); setConfirmation(''); setSuccess(true);
    } finally { setIsSubmitting(false); }
  };

  if (!authorized) return <div role="status" className="text-center text-sm text-slate-500">{locale === 'es' ? 'Validando recuperación…' : 'Validating recovery…'}</div>;
  if (success) return <div role="status" aria-live="polite" className="text-center"><span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-100 text-2xl text-emerald-800">✓</span><h2 className="mt-4 text-2xl font-bold text-slate-900">{locale === 'es' ? 'Contraseña actualizada' : 'Password updated'}</h2><p className="mt-2 text-slate-500">{locale === 'es' ? 'Ya puedes iniciar sesión con tu nueva contraseña.' : 'You can now sign in with your new password.'}</p><Link href={`/${locale}/login`} className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-[#075b40] px-6 font-bold text-white">{dict.signIn}</Link></div>;

  return <div className="w-full"><div className="mb-9"><h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.85rem]">{dict.title}</h2><p className="mt-2 text-sm leading-relaxed text-slate-500 sm:text-base">{dict.subtitle}</p></div><form onSubmit={handleSubmit} className="space-y-7"><div><PasswordInput id="recovery-password" label={dict.password} placeholder={dict.passwordPlaceholder} value={password} visible={showPassword} onChange={setPassword} onToggle={() => setShowPassword((value) => !value)} dict={dict}/><div className="mt-3 flex items-center gap-3" aria-live="polite"><div className="grid flex-1 grid-cols-4 gap-1.5">{[0,1,2,3].map((segment) => <span key={segment} className={`h-2 rounded-full ${segment < activeSegments ? (strength === 5 ? 'bg-emerald-600' : strength >= 3 ? 'bg-lime-500' : 'bg-amber-400') : 'bg-slate-200'}`}/>)}</div><span className="min-w-14 text-sm font-semibold text-slate-600">{strength === 5 ? dict.strength.strong : strength >= 3 ? dict.strength.medium : dict.strength.weak}</span></div><p className="mt-2 text-sm text-slate-500">{dict.passwordHint}</p></div><PasswordInput id="recovery-confirmation" label={dict.confirmation} placeholder={dict.confirmationPlaceholder} value={confirmation} visible={showConfirmation} onChange={setConfirmation} onToggle={() => setShowConfirmation((value) => !value)} dict={dict}/><button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="min-h-14 w-full rounded-xl bg-[#075b40] px-5 text-base font-semibold text-white disabled:opacity-60">{isSubmitting ? (locale === 'es' ? 'Actualizando…' : 'Updating…') : dict.submit}</button></form><p className="mt-8 text-center text-sm text-slate-600">{dict.rememberedPassword}{' '}<Link href={`/${locale}/login`} className="font-bold text-[#08704d] hover:underline">{dict.signIn}</Link></p></div>;
}
