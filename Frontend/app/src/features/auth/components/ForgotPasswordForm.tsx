"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Locale } from "@/shared/i18n/config";
import type { ForgotPasswordDictionary } from "@/shared/i18n/dictionaries/forgotPassword";
import {
  isValidEmail,
  MAX_EMAIL_LENGTH,
  normalizeEmail,
} from "../lib/validation";
import { VerificationCodeForm } from "./VerificationCodeForm";
import { apiClient } from '@/shared/api/apiClient';

export function ForgotPasswordForm({
  dict,
  locale,
}: {
  dict: ForgotPasswordDictionary;
  locale: Locale;
}) {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const issueCode = async () => {
    await apiClient('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email: normalizeEmail(email) }) });
  };

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const input = event.currentTarget.elements.namedItem(
      "recovery-email",
    ) as HTMLInputElement;
    const normalized = normalizeEmail(email);
    input.setCustomValidity(
      isValidEmail(normalized) ? "" : dict.validation.email,
    );
    if (!event.currentTarget.reportValidity()) return;
    setEmail(normalized);
    setIsSending(true);
    try {
      await issueCode();
      setStep("code");
    } catch {
      setError(
        locale === "es"
          ? "No pudimos preparar el código. Intenta nuevamente."
          : "We could not prepare the code. Try again.",
      );
    } finally {
      setIsSending(false);
    }
  };

  const verifyCode = async (code: string) => {
    const result = await apiClient<{ resetToken: string }>('/api/auth/verify-reset-code', { method: 'POST', body: JSON.stringify({ email, code }) });
    sessionStorage.setItem('kinti_reset_token', result.resetToken);
    sessionStorage.setItem('kinti_recovery_email', email);
    router.replace(`/${locale}/reset-password`);
  };

  return (
    <div className="w-full">
      {step === "email" ? (
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.85rem]">
              {dict.title}
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500 sm:text-base">
              {dict.subtitle}
            </p>
          </div>
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label
                htmlFor="recovery-email"
                className="block text-sm font-semibold text-slate-900 sm:text-base"
              >
                {dict.email}
              </label>
              <input
                id="recovery-email"
                name="recovery-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onBlur={() => setEmail((value) => normalizeEmail(value))}
                onInput={(event) => event.currentTarget.setCustomValidity("")}
                placeholder={dict.emailPlaceholder}
                required
                maxLength={MAX_EMAIL_LENGTH}
                className="min-h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none focus:border-[#08704d] focus:ring-3 focus:ring-emerald-700/10"
              />
            </div>
            <button
              type="submit"
              disabled={isSending}
              aria-busy={isSending}
              className="min-h-14 w-full rounded-xl bg-[#075b40] px-5 text-base font-semibold text-white disabled:opacity-60"
            >
              {isSending
                ? locale === "es"
                  ? "Enviando código…"
                  : "Sending code…"
                : dict.sendCode}
            </button>
          </form>
        </div>
      ) : (
        <>
          <VerificationCodeForm
            title={dict.codeTitle}
            description={
              <>
                {dict.codeSubtitle}{" "}
                <strong className="font-semibold text-slate-700">
                  {email}
                </strong>
                .
              </>
            }
            codeLabel={dict.code}
            codePlaceholder={dict.codePlaceholder}
            verifyLabel={dict.verifyCode}
            resendLabel={dict.resendCode}
            changeEmailLabel={dict.changeEmail}
            invalidCodeMessage={dict.validation.code}
            onVerify={verifyCode}
            onResend={issueCode}
            onChangeEmail={() => {
              setStep("email");
            }}
            verifyingLabel={locale === "es" ? "Verificando…" : "Verifying…"}
            resendingLabel={locale === "es" ? "Enviando…" : "Sending…"}
            resendSuccessMessage={
              locale === "es"
                ? "Enviamos un nuevo código de recuperación."
                : "We sent a new recovery code."
            }
            waitLabel={(seconds) =>
              locale === "es"
                ? `Reintenta en ${seconds}s`
                : `Try again in ${seconds}s`
            }
          />
        </>
      )}
      <p className="mt-9 text-center text-sm font-medium text-slate-600 sm:text-base">
        {dict.rememberedPassword}{" "}
        <Link
          href={`/${locale}/login`}
          className="font-bold text-[#08704d] hover:underline"
        >
          {dict.signIn}
        </Link>
      </p>
    </div>
  );
}
