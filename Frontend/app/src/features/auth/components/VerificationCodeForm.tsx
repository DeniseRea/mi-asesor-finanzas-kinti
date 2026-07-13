'use client';

import { useEffect, useState } from 'react';

interface VerificationCodeFormProps {
  title: string;
  description: React.ReactNode;
  codeLabel: string;
  codePlaceholder: string;
  verifyLabel: string;
  resendLabel: string;
  changeEmailLabel: string;
  invalidCodeMessage: string;
  onVerify: (code: string) => void | Promise<void>;
  onResend?: () => void | Promise<void>;
  onChangeEmail: () => void;
  verifyingLabel?: string;
  resendingLabel?: string;
  resendSuccessMessage?: string;
  waitLabel?: (seconds: number) => string;
}

export function VerificationCodeForm({ title, description, codeLabel, codePlaceholder, verifyLabel, resendLabel, changeEmailLabel, invalidCodeMessage, onVerify, onResend, onChangeEmail, verifyingLabel = 'Verificando…', resendingLabel = 'Enviando…', resendSuccessMessage = 'Solicitamos un nuevo código.', waitLabel = (seconds) => `Espera ${seconds}s` }: VerificationCodeFormProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setStatus('');
    const input = event.currentTarget.elements.namedItem('verification-code') as HTMLInputElement;
    input.setCustomValidity(/^\d{6}$/.test(code) ? '' : invalidCodeMessage);
    if (!event.currentTarget.reportValidity()) return;
    setIsSubmitting(true);
    try { await onVerify(code); }
    catch (reason) { setError(reason instanceof Error ? reason.message : invalidCodeMessage); }
    finally { setIsSubmitting(false); }
  };

  const handleResend = async () => {
    if (!onResend || cooldown > 0 || isResending) return;
    setCode(''); setError(''); setStatus(''); setIsResending(true);
    try {
      await onResend();
      setStatus(resendSuccessMessage);
      setCooldown(30);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No pudimos solicitar otro código.');
    } finally { setIsResending(false); }
  };

  return <div className="w-full"><div className="mb-8"><h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.85rem]">{title}</h2><p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500 sm:text-base">{description}</p></div><form onSubmit={handleSubmit} className="space-y-6">{error && <div role="alert" aria-live="assertive" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}{status && <div role="status" aria-live="polite" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{status}</div>}<div className="space-y-2"><label htmlFor="verification-code" className="block text-sm font-semibold text-slate-900 sm:text-base">{codeLabel}</label><input id="verification-code" name="verification-code" type="text" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} onInput={(event) => event.currentTarget.setCustomValidity('')} placeholder={codePlaceholder} required minLength={6} maxLength={6} pattern="[0-9]{6}" className="min-h-16 w-full rounded-xl border border-slate-300 bg-white px-5 text-center text-2xl font-bold tracking-[0.55em] text-slate-900 outline-none transition placeholder:text-slate-300 hover:border-slate-400 focus:border-[#08704d] focus:ring-3 focus:ring-emerald-700/10"/></div><button type="submit" disabled={isSubmitting || isResending} aria-busy={isSubmitting} className="relative flex min-h-14 w-full items-center justify-center rounded-xl bg-[#075b40] px-5 text-base font-semibold text-white shadow-[0_8px_20px_rgba(7,91,64,0.2)] transition hover:bg-[#064c36] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075b40] disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? verifyingLabel : verifyLabel}</button><div className="flex items-center justify-center gap-5 text-sm font-semibold"><button type="button" onClick={handleResend} disabled={!onResend || cooldown > 0 || isResending} className="text-[#08704d] hover:underline disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline">{isResending ? resendingLabel : cooldown > 0 ? waitLabel(cooldown) : resendLabel}</button><button type="button" onClick={onChangeEmail} disabled={isSubmitting || isResending} className="text-slate-500 hover:text-slate-800 hover:underline disabled:opacity-50">{changeEmailLabel}</button></div></form></div>;
}
