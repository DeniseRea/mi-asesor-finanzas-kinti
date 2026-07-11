export const MAX_EMAIL_LENGTH = 254;
export const MAX_NAME_LENGTH = 80;
export const MAX_PASSWORD_LENGTH = 64;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿÑñ]+(?:[ '\-][A-Za-zÀ-ÖØ-öø-ÿÑñ]+)*$/;
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string): boolean {
  const normalized = normalizeEmail(value);
  return normalized.length <= MAX_EMAIL_LENGTH && EMAIL_PATTERN.test(normalized);
}

export function isValidName(value: string): boolean {
  const normalized = value.trim().replace(/\s+/g, ' ');
  return normalized.length >= 2 && normalized.length <= MAX_NAME_LENGTH && NAME_PATTERN.test(normalized);
}

export interface PasswordChecks {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  symbol: boolean;
  safeCharacters: boolean;
}

export function getPasswordChecks(value: string): PasswordChecks {
  return {
    length: value.length >= 8 && value.length <= MAX_PASSWORD_LENGTH,
    uppercase: /[A-ZÁÉÍÓÚÜÑ]/.test(value),
    lowercase: /[a-záéíóúüñ]/.test(value),
    number: /\d/.test(value),
    symbol: /[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s]/.test(value),
    safeCharacters: !CONTROL_CHARACTERS.test(value),
  };
}

export function isStrongPassword(value: string): boolean {
  return Object.values(getPasswordChecks(value)).every(Boolean);
}

export function getPasswordStrength(value: string): number {
  const checks = getPasswordChecks(value);
  return [checks.length, checks.uppercase, checks.lowercase, checks.number, checks.symbol].filter(Boolean).length;
}
