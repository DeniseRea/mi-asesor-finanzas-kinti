import type { Locale } from '../config';

export interface PasswordRecoveryDictionary {
  backToLogin: string;
  title: string;
  subtitle: string;
  password: string;
  passwordPlaceholder: string;
  confirmation: string;
  confirmationPlaceholder: string;
  passwordHint: string;
  submit: string;
  rememberedPassword: string;
  signIn: string;
  changeLanguage: string;
  changeTheme: string;
  showPassword: string;
  hidePassword: string;
  strength: {
    weak: string;
    medium: string;
    strong: string;
  };
  validation: {
    password: string;
    confirmation: string;
  };
  hero: {
    lineOne: string;
    lineTwoPrefix: string;
    lineTwoAccent: string;
    description: string;
  };
}

const passwordRecoveryDictionaries: Record<Locale, PasswordRecoveryDictionary> = {
  es: {
    backToLogin: 'Volver al inicio',
    title: 'Crear nueva contraseña',
    subtitle: 'Tu nueva contraseña debe ser segura y diferente a las anteriores.',
    password: 'Nueva contraseña',
    passwordPlaceholder: 'Escribe tu nueva contraseña',
    confirmation: 'Confirmación de contraseña',
    confirmationPlaceholder: 'Confirma tu nueva contraseña',
    passwordHint: 'Mínimo 8 caracteres, incluye mayúsculas, minúsculas, números y símbolos.',
    submit: 'Actualizar contraseña',
    rememberedPassword: '¿Recordaste tu contraseña?',
    signIn: 'Iniciar sesión',
    changeLanguage: 'Cambiar idioma a inglés',
    changeTheme: 'Cambiar tema',
    showPassword: 'Mostrar contraseña',
    hidePassword: 'Ocultar contraseña',
    strength: { weak: 'Débil', medium: 'Media', strong: 'Fuerte' },
    validation: {
      password: 'Usa entre 8 y 64 caracteres con mayúscula, minúscula, número y símbolo.',
      confirmation: 'Las contraseñas deben coincidir.',
    },
    hero: {
      lineOne: 'Dale un nuevo',
      lineTwoPrefix: 'comienzo a tu',
      lineTwoAccent: 'seguridad',
      description: 'Crea una contraseña segura y única\npara proteger tu información y\nseguir construyendo tu bienestar\nfinanciero con Kinti.',
    },
  },
  en: {
    backToLogin: 'Back to login',
    title: 'Create a new password',
    subtitle: 'Your new password must be secure and different from previous ones.',
    password: 'New password',
    passwordPlaceholder: 'Enter your new password',
    confirmation: 'Confirm password',
    confirmationPlaceholder: 'Confirm your new password',
    passwordHint: 'Use at least 8 characters with uppercase, lowercase, numbers, and symbols.',
    submit: 'Update password',
    rememberedPassword: 'Remembered your password?',
    signIn: 'Sign in',
    changeLanguage: 'Switch language to Spanish',
    changeTheme: 'Change theme',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    strength: { weak: 'Weak', medium: 'Medium', strong: 'Strong' },
    validation: {
      password: 'Use 8–64 characters with uppercase, lowercase, a number, and a symbol.',
      confirmation: 'Passwords must match.',
    },
    hero: {
      lineOne: 'Give your security',
      lineTwoPrefix: 'a new',
      lineTwoAccent: 'beginning',
      description: 'Create a secure, unique password\nto protect your information and\nkeep building your financial\nwell-being with Kinti.',
    },
  },
};

export function getPasswordRecoveryDictionary(locale: Locale): PasswordRecoveryDictionary {
  return passwordRecoveryDictionaries[locale];
}
