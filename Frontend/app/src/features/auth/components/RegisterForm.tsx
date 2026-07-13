'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/shared/i18n/config';
import type { RegisterDictionary } from '@/shared/i18n/dictionaries/register';
import { useAuth } from '@/shared/lib/auth-context';
import { isStrongPassword, isValidEmail, isValidName, MAX_EMAIL_LENGTH, MAX_NAME_LENGTH, MAX_PASSWORD_LENGTH, normalizeEmail } from '../lib/validation';
import { getAuthErrorMessage } from '../lib/auth-errors';
import { VerificationCodeForm } from './VerificationCodeForm';

interface RegisterFormProps {
  dict: RegisterDictionary;
  locale: Locale;
}

interface PasswordInputProps {
  id: string;
  label: string;
  placeholder: string;
  visible: boolean;
  onToggle: () => void;
  showLabel: string;
  hideLabel: string;
  autoComplete: 'new-password';
  value: string;
  onChange: (value: string) => void;
}

function PasswordInput({ id, label, placeholder, visible, onToggle, showLabel, hideLabel, autoComplete, value, onChange }: PasswordInputProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-900">{label}</label>
      <div className="relative">
        <svg aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <input id={id} name={id} type={visible ? 'text' : 'password'} autoComplete={autoComplete} value={value} onChange={(event) => onChange(event.target.value)} onInput={(event) => event.currentTarget.setCustomValidity('')} placeholder={placeholder} className="min-h-12 w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#08704d] focus:ring-3 focus:ring-emerald-700/10" required minLength={8} maxLength={MAX_PASSWORD_LENGTH} />
        <button type="button" onClick={onToggle} aria-label={visible ? hideLabel : showLabel} aria-pressed={visible} className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#075b40]">
          <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {visible ? <path d="M3 3l18 18M10.6 10.6A2 2 0 0 0 13.4 13.4M9.9 4.2A10 10 0 0 1 12 4c7 0 11 8 11 8a18 18 0 0 1-2.2 3.2M6.1 6.1A18 18 0 0 0 1 12s4 8 11 8a10 10 0 0 0 5.9-2" /> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8Z" /><circle cx="12" cy="12" r="3" /></>}
          </svg>
        </button>
      </div>
    </div>
  );
}

export function RegisterForm({ dict, locale }: RegisterFormProps) {
  const [step, setStep] = useState<'details' | 'verification'>('details');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, loginWithGoogle, verifyEmail, resendVerification } = useAuth();
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      router.replace(`/${locale}/dashboard/completar-perfil`);
    } catch (err) {
      setError(getAuthErrorMessage(err, locale));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const form = event.currentTarget;
    const nameInput = form.elements.namedItem('name') as HTMLInputElement;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
    const passwordInput = form.elements.namedItem('register-password') as HTMLInputElement;
    const confirmationInput = form.elements.namedItem('register-confirm-password') as HTMLInputElement;

    nameInput.setCustomValidity(isValidName(name) ? '' : dict.validation.name);
    emailInput.setCustomValidity(isValidEmail(email) ? '' : dict.validation.email);
    passwordInput.setCustomValidity(isStrongPassword(password) ? '' : dict.validation.password);
    confirmationInput.setCustomValidity(password === confirmation ? '' : dict.validation.confirmation);

    if (!form.reportValidity()) return;

    setIsSubmitting(true);
    try {
      const normalizedEmail = normalizeEmail(email);
      setEmail(normalizedEmail);
      const result = await register({ name, email: normalizedEmail, password, confirmPassword: confirmation });
      setVerificationToken(result.verificationToken);
      setStep('verification');
    } catch (err) {
      setError(getAuthErrorMessage(err, locale));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (code: string) => {
    const normalizedEmail = normalizeEmail(email);
    if (!verificationToken) throw new Error(locale === 'es' ? 'La verificación expiró. Inicia nuevamente.' : 'Verification expired. Start again.');
    try { await verifyEmail({ email: normalizedEmail, code, verificationToken }); }
    catch (reason) { throw new Error(getAuthErrorMessage(reason, locale)); }
    sessionStorage.setItem('kinti_auth_feedback', 'account_verified');
    router.replace(`/${locale}/login`);
  };

  const handleResend = async () => {
    const normalizedEmail = normalizeEmail(email);
    if (!verificationToken) throw new Error(locale === 'es' ? 'La verificación expiró. Inicia nuevamente.' : 'Verification expired. Start again.');
    try { const result = await resendVerification({ email: normalizedEmail, verificationToken }); setVerificationToken(result.verificationToken); }
    catch (reason) { throw new Error(getAuthErrorMessage(reason, locale)); }
  };

  if (step === 'verification') {
    return (
      <VerificationCodeForm
        title={dict.verification.title}
        description={<>{dict.verification.subtitle} <strong className="font-semibold text-slate-700">{normalizeEmail(email)}</strong>.</>}
        codeLabel={dict.verification.code}
        codePlaceholder={dict.verification.codePlaceholder}
        verifyLabel={dict.verification.verify}
        resendLabel={dict.verification.resend}
        changeEmailLabel={dict.verification.changeEmail}
        invalidCodeMessage={dict.verification.invalidCode}
        onVerify={handleVerify}
        onResend={handleResend}
        onChangeEmail={() => { setVerificationToken(''); setStep('details'); }}
        verifyingLabel={locale === 'es' ? 'Verificando cuenta…' : 'Verifying account…'}
        resendingLabel={locale === 'es' ? 'Enviando…' : 'Sending…'}
        resendSuccessMessage={locale === 'es' ? 'Solicitamos un nuevo código. Revisa tu correo.' : 'We requested a new code. Check your email.'}
        waitLabel={(seconds) => locale === 'es' ? `Reintenta en ${seconds}s` : `Try again in ${seconds}s`}
      />
    );
  }

  return (
    <div className="w-full">
      <div className="mb-5">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.75rem]">{dict.title}</h2>
        <p className="mt-1 text-sm text-slate-500">{dict.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div role="alert" aria-live="assertive" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="register-name" className="block text-sm font-semibold text-slate-900">{dict.name}</label>
          <div className="relative">
            <svg aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
            <input id="register-name" name="name" type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} onBlur={() => setName((value) => value.trim().replace(/\s+/g, ' '))} onInput={(event) => event.currentTarget.setCustomValidity('')} placeholder={dict.namePlaceholder} className="min-h-12 w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#08704d] focus:ring-3 focus:ring-emerald-700/10" required minLength={2} maxLength={MAX_NAME_LENGTH} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="register-email" className="block text-sm font-semibold text-slate-900">{dict.email}</label>
          <div className="relative">
            <svg aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-9 5.7a2 2 0 0 1-2 0L2 7" /></svg>
            <input id="register-email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} onBlur={() => setEmail((value) => normalizeEmail(value))} onInput={(event) => event.currentTarget.setCustomValidity('')} placeholder={dict.emailPlaceholder} className="min-h-12 w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#08704d] focus:ring-3 focus:ring-emerald-700/10" required maxLength={MAX_EMAIL_LENGTH} />
          </div>
        </div>

        <div>
          <PasswordInput id="register-password" label={dict.password} placeholder={dict.passwordPlaceholder} visible={showPassword} onToggle={() => setShowPassword((value) => !value)} showLabel={dict.showPassword} hideLabel={dict.hidePassword} autoComplete="new-password" value={password} onChange={setPassword} />
          <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{dict.passwordHint}</p>
        </div>

        <PasswordInput id="register-confirm-password" label={dict.confirmPassword} placeholder={dict.confirmPasswordPlaceholder} visible={showConfirmation} onToggle={() => setShowConfirmation((value) => !value)} showLabel={dict.showPassword} hideLabel={dict.hidePassword} autoComplete="new-password" value={confirmation} onChange={setConfirmation} />

        <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
          <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[#075b40]" />
          <span>{dict.accept} <a href="#" className="font-semibold text-[#075b40] hover:underline">{dict.terms}</a> {dict.and} <a href="#" className="font-semibold text-[#075b40] hover:underline">{dict.privacy}</a>.</span>
        </label>

        <button type="submit" disabled={isSubmitting} className="relative flex min-h-12 w-full items-center justify-center rounded-xl bg-[#075b40] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(7,91,64,0.2)] transition hover:bg-[#064c36] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075b40] disabled:opacity-60 disabled:cursor-not-allowed">
          {isSubmitting ? (locale === 'es' ? 'Creando cuenta…' : 'Creating account…') : dict.submit}
          {!isSubmitting && (
            <svg aria-hidden="true" className="absolute right-5 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
          )}
        </button>
      </form>

      <div className="my-5 flex items-center gap-4"><span className="h-px flex-1 bg-slate-200" /><span className="text-xs font-medium text-slate-500">{dict.continueWith}</span><span className="h-px flex-1 bg-slate-200" /></div>
      <button type="button" onClick={handleGoogleLogin} disabled={isSubmitting} aria-label={`${dict.continueWithProvider} ${dict.google}`} className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075b40] disabled:opacity-60 disabled:cursor-not-allowed">
        <Image src="/assets/login/google-g.svg" alt="" width={21} height={21} /><span>{dict.google}</span>
      </button>
      <p className="mt-5 text-center text-sm font-medium text-slate-600">{dict.alreadyAccount}{' '}<Link href={`/${locale}/login`} className="font-bold text-[#08704d] hover:underline">{dict.signIn}</Link></p>
    </div>
  );
}
