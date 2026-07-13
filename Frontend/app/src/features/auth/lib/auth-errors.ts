import { ApiError } from '@/shared/api/apiClient';
import type { Locale } from '@/shared/i18n/config';

const messages = {
  es: {
    invalidCredentials: 'El correo o la contraseña no son correctos.', unverified: 'Debes verificar tu correo antes de continuar.', locked: 'Tu cuenta está temporalmente bloqueada. Intenta más tarde.', emailExists: 'Ya existe una cuenta con este correo electrónico.', invalidCode: 'El código ingresado no es válido.', expiredCode: 'El código venció. Solicita uno nuevo.', rateLimit: 'Has realizado demasiados intentos. Espera unos minutos.', timeout: 'La solicitud está tardando demasiado. Intenta nuevamente.', network: 'No pudimos conectarnos. Revisa tu conexión e intenta nuevamente.', unavailable: 'El servicio no está disponible en este momento. Intenta más tarde.', generic: 'No pudimos completar la solicitud. Intenta nuevamente.', googleCancelled: 'Se canceló el inicio de sesión con Google.',
  },
  en: {
    invalidCredentials: 'The email or password is incorrect.', unverified: 'You must verify your email before continuing.', locked: 'Your account is temporarily locked. Try again later.', emailExists: 'An account already exists with this email address.', invalidCode: 'The code you entered is not valid.', expiredCode: 'The code has expired. Request a new one.', rateLimit: 'Too many attempts. Wait a few minutes and try again.', timeout: 'The request is taking too long. Try again.', network: 'We could not connect. Check your connection and try again.', unavailable: 'The service is currently unavailable. Try again later.', generic: 'We could not complete the request. Try again.', googleCancelled: 'Google sign-in was cancelled.',
  },
} as const;

export function getAuthErrorMessage(error: unknown, locale: Locale): string {
  const text = messages[locale];
  if (!(error instanceof ApiError)) {
    const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
    if (code.includes('popup-closed') || code.includes('cancelled-popup')) return text.googleCancelled;
    if (code.includes('network-request-failed')) return text.network;
    return text.generic;
  }
  const code = error.code?.toUpperCase();
  if (code === 'EMAIL_NOT_VERIFIED') return text.unverified;
  if (code === 'ACCOUNT_LOCKED') return text.locked;
  if (code === 'EMAIL_ALREADY_EXISTS') return text.emailExists;
  if (code === 'INVALID_CODE') return text.invalidCode;
  if (code === 'CODE_EXPIRED') return text.expiredCode;
  if (code === 'REQUEST_TIMEOUT') return text.timeout;
  if (code === 'NETWORK_ERROR') return text.network;
  if (error.status === 401) return text.invalidCredentials;
  if (error.status === 409) return text.emailExists;
  if (error.status === 429) return text.rateLimit;
  if (error.status !== null && error.status >= 500) return text.unavailable;
  return text.generic;
}
