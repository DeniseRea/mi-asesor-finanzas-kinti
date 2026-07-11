import type { Locale } from '../config';

export interface RegisterDictionary {
  brandName: string;
  backToLogin: string;
  title: string;
  subtitle: string;
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  passwordHint: string;
  confirmPassword: string;
  confirmPasswordPlaceholder: string;
  accept: string;
  terms: string;
  and: string;
  privacy: string;
  submit: string;
  continueWith: string;
  continueWithProvider: string;
  google: string;
  alreadyAccount: string;
  signIn: string;
  changeLanguage: string;
  changeTheme: string;
  showPassword: string;
  hidePassword: string;
  validation: {
    name: string;
    email: string;
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

const registerDictionaries: Record<Locale, RegisterDictionary> = {
  es: {
    brandName: 'kinti',
    backToLogin: 'Volver al inicio',
    title: 'Crear cuenta',
    subtitle: 'Completa tus datos para comenzar',
    name: 'Nombre',
    namePlaceholder: 'Escribe tu nombre completo',
    email: 'Correo electrónico',
    emailPlaceholder: 'ejemplo@kinti.app',
    password: 'Contraseña',
    passwordPlaceholder: 'Crea una contraseña',
    passwordHint: 'Debe tener al menos 8 caracteres e incluir mayúsculas, minúsculas y números.',
    confirmPassword: 'Confirmar contraseña',
    confirmPasswordPlaceholder: 'Confirma tu contraseña',
    accept: 'Acepto los',
    terms: 'Términos y Condiciones',
    and: 'y la',
    privacy: 'Política de Privacidad',
    submit: 'Crear cuenta',
    continueWith: 'o continúa con',
    continueWithProvider: 'Continuar con',
    google: 'Google',
    alreadyAccount: '¿Ya tienes cuenta?',
    signIn: 'Iniciar sesión',
    changeLanguage: 'Cambiar idioma a inglés',
    changeTheme: 'Cambiar tema',
    showPassword: 'Mostrar contraseña',
    hidePassword: 'Ocultar contraseña',
    validation: {
      name: 'Usa entre 2 y 80 letras; puedes incluir espacios, apóstrofes y guiones.',
      email: 'Ingresa un correo electrónico válido.',
      password: 'Usa entre 8 y 64 caracteres con mayúscula, minúscula, número y símbolo.',
      confirmation: 'Las contraseñas deben coincidir.',
    },
    hero: {
      lineOne: 'Empieza hoy,',
      lineTwoPrefix: 'construye',
      lineTwoAccent: 'tu futuro',
      description: 'Crea tu cuenta y toma el control\nde tus finanzas.',
    },
  },
  en: {
    brandName: 'kinti',
    backToLogin: 'Back to login',
    title: 'Create account',
    subtitle: 'Complete your details to get started',
    name: 'Name',
    namePlaceholder: 'Enter your full name',
    email: 'Email',
    emailPlaceholder: 'example@kinti.app',
    password: 'Password',
    passwordPlaceholder: 'Create a password',
    passwordHint: 'Use at least 8 characters including uppercase, lowercase, and numbers.',
    confirmPassword: 'Confirm password',
    confirmPasswordPlaceholder: 'Confirm your password',
    accept: 'I accept the',
    terms: 'Terms and Conditions',
    and: 'and the',
    privacy: 'Privacy Policy',
    submit: 'Create account',
    continueWith: 'or continue with',
    continueWithProvider: 'Continue with',
    google: 'Google',
    alreadyAccount: 'Already have an account?',
    signIn: 'Sign in',
    changeLanguage: 'Switch language to Spanish',
    changeTheme: 'Change theme',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    validation: {
      name: 'Use 2–80 letters; spaces, apostrophes, and hyphens are allowed.',
      email: 'Enter a valid email address.',
      password: 'Use 8–64 characters with uppercase, lowercase, a number, and a symbol.',
      confirmation: 'Passwords must match.',
    },
    hero: {
      lineOne: 'Start today,',
      lineTwoPrefix: 'build',
      lineTwoAccent: 'your future',
      description: 'Create your account and take control\nof your finances.',
    },
  },
};

export function getRegisterDictionary(locale: Locale): RegisterDictionary {
  return registerDictionaries[locale];
}
