import type { Locale } from '../config';

export interface LoginDictionary {
  brandName: string;
  email: string;
  emailPlaceholder: string;
  password: string;
  forgotPassword: string;
  submit: string;
  continueWith: string;
  google: string;
  noAccount: string;
  createAccount: string;
  changeLanguage: string;
  changeTheme: string;
  showPassword: string;
  hidePassword: string;
  continueWithProvider: string;
  backHome: string;
  validation: {
    email: string;
    password: string;
  };
  journey: {
    lineOne: string;
    lineTwo: string;
    description: string;
    know: string;
    control: string;
    improve: string;
  };
}

const loginDictionaries: Record<Locale, LoginDictionary> = {
  es: {
    brandName: 'kinti',
    email: 'Correo electrónico',
    emailPlaceholder: 'ejemplo@kinti.app',
    password: 'Contraseña',
    forgotPassword: '¿Olvidaste tu contraseña?',
    submit: 'Iniciar sesión',
    continueWith: 'o continúa con',
    google: 'Google',
    noAccount: '¿No tienes cuenta?',
    createAccount: 'Crear cuenta',
    changeLanguage: 'Cambiar idioma a inglés',
    changeTheme: 'Cambiar tema',
    showPassword: 'Mostrar contraseña',
    hidePassword: 'Ocultar contraseña',
    continueWithProvider: 'Continuar con',
    backHome: 'Volver al inicio',
    validation: {
      email: 'Ingresa un correo electrónico válido.',
      password: 'La contraseña debe tener entre 8 y 64 caracteres, con mayúscula, minúscula, número y símbolo.',
    },
    journey: {
      lineOne: 'Tu dinero,',
      lineTwo: 'en equilibrio',
      description: 'Pequeñas decisiones hoy,\ngrandes cambios mañana.',
      know: 'Conoce',
      control: 'Controla',
      improve: 'Mejora',
    },
  },
  en: {
    brandName: 'kinti',
    email: 'Email',
    emailPlaceholder: 'example@kinti.app',
    password: 'Password',
    forgotPassword: 'Forgot your password?',
    submit: 'Sign in',
    continueWith: 'or continue with',
    google: 'Google',
    noAccount: "Don't have an account?",
    createAccount: 'Create account',
    changeLanguage: 'Switch language to Spanish',
    changeTheme: 'Change theme',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    continueWithProvider: 'Continue with',
    backHome: 'Back to home',
    validation: {
      email: 'Enter a valid email address.',
      password: 'Use 8–64 characters with uppercase, lowercase, a number, and a symbol.',
    },
    journey: {
      lineOne: 'Your money,',
      lineTwo: 'in balance',
      description: 'Small decisions today,\nbig changes tomorrow.',
      know: 'Know',
      control: 'Control',
      improve: 'Improve',
    },
  },
};

export function getLoginDictionary(locale: Locale): LoginDictionary {
  return loginDictionaries[locale];
}
