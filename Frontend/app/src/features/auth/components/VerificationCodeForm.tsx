'use client';

import { useState } from 'react';

interface VerificationCodeFormProps {
  title: string;
  description: React.ReactNode;
  codeLabel: string;
  codePlaceholder: string;
  verifyLabel: string;
  resendLabel: string;
  changeEmailLabel: string;
  invalidCodeMessage: string;
  onVerify: () => void;
  onChangeEmail: () => void;
}

export function VerificationCodeForm({ title, description, codeLabel, codePlaceholder, verifyLabel, resendLabel, changeEmailLabel, invalidCodeMessage, onVerify, onChangeEmail }: VerificationCodeFormProps) {
  const [code, setCode] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem('verification-code') as HTMLInputElement;
    input.setCustomValidity(/^\d{6}$/.test(code) ? '' : invalidCodeMessage);
    if (!event.currentTarget.reportValidity()) return;
    onVerify();
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.85rem]">{title}</h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500 sm:text-base">{description}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="verification-code" className="block text-sm font-semibold text-slate-900 sm:text-base">{codeLabel}</label>
          <input id="verification-code" name="verification-code" type="text" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} onInput={(event) => event.currentTarget.setCustomValidity('')} placeholder={codePlaceholder} required minLength={6} maxLength={6} pattern="[0-9]{6}" className="min-h-16 w-full rounded-xl border border-slate-300 bg-white px-5 text-center text-2xl font-bold tracking-[0.55em] text-slate-900 outline-none transition placeholder:text-slate-300 hover:border-slate-400 focus:border-[#08704d] focus:ring-3 focus:ring-emerald-700/10" />
        </div>
        <button type="submit" className="relative flex min-h-14 w-full items-center justify-center rounded-xl bg-[#075b40] px-5 text-base font-semibold text-white shadow-[0_8px_20px_rgba(7,91,64,0.2)] transition hover:bg-[#064c36] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075b40]">{verifyLabel}<svg aria-hidden="true" className="absolute right-5 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg></button>
        <div className="flex items-center justify-center gap-5 text-sm font-semibold">
          <button type="button" onClick={() => setCode('')} className="text-[#08704d] hover:underline">{resendLabel}</button>
          <button type="button" onClick={onChangeEmail} className="text-slate-500 hover:text-slate-800 hover:underline">{changeEmailLabel}</button>
        </div>
      </form>
    </div>
  );
}
