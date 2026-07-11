import type { Locale } from '../config';

export interface ForgotPasswordDictionary {
  backToLogin: string;
  title: string;
  subtitle: string;
  email: string;
  emailPlaceholder: string;
  sendCode: string;
  codeTitle: string;
  codeSubtitle: string;
  code: string;
  codePlaceholder: string;
  verifyCode: string;
  resendCode: string;
  changeEmail: string;
  rememberedPassword: string;
  signIn: string;
  changeLanguage: string;
  changeTheme: string;
  validation: {
    email: string;
    code: string;
  };
  hero: {
    lineOne: string;
    lineTwoPrefix: string;
    lineTwoAccent: string;
    description: string;
  };
}

const forgotPasswordDictionaries: Record<Locale, ForgotPasswordDictionary> = {
  es: {
    backToLogin: 'Volver al inicio',
    title: 'Recuperar contraseña',
    subtitle: 'Ingresa el correo asociado a tu cuenta y te enviaremos un código de verificación.',
    email: 'Correo electrónico',
    emailPlaceholder: 'ejemplo@kinti.app',
    sendCode: 'Enviar código',
    codeTitle: 'Verifica tu correo',
    codeSubtitle: 'Ingresa el código de 6 dígitos solicitado para',
    code: 'Código de verificación',
    codePlaceholder: '000000',
    verifyCode: 'Verificar código',
    resendCode: 'Solicitar otro código',
    changeEmail: 'Cambiar correo',
    rememberedPassword: '¿Recordaste tu contraseña?',
    signIn: 'Iniciar sesión',
    changeLanguage: 'Cambiar idioma a inglés',
    changeTheme: 'Cambiar tema',
    validation: {
      email: 'Ingresa un correo electrónico válido.',
      code: 'El código debe contener exactamente 6 números.',
    },
    hero: {
      lineOne: 'Recupera el acceso,',
      lineTwoPrefix: 'vuelve a tu',
      lineTwoAccent: 'tranquilidad',
      description: 'Confirma el correo de tu cuenta\ny verifica el código para continuar\nde forma segura.',
    },
  },
  en: {
    backToLogin: 'Back to login',
    title: 'Recover password',
    subtitle: 'Enter the email associated with your account and we will send you a verification code.',
    email: 'Email',
    emailPlaceholder: 'example@kinti.app',
    sendCode: 'Send code',
    codeTitle: 'Verify your email',
    codeSubtitle: 'Enter the requested 6-digit code for',
    code: 'Verification code',
    codePlaceholder: '000000',
    verifyCode: 'Verify code',
    resendCode: 'Request another code',
    changeEmail: 'Change email',
    rememberedPassword: 'Remembered your password?',
    signIn: 'Sign in',
    changeLanguage: 'Switch language to Spanish',
    changeTheme: 'Change theme',
    validation: {
      email: 'Enter a valid email address.',
      code: 'The code must contain exactly 6 numbers.',
    },
    hero: {
      lineOne: 'Recover access,',
      lineTwoPrefix: 'return to',
      lineTwoAccent: 'peace of mind',
      description: 'Confirm your account email\nand verify the code to continue\nsecurely.',
    },
  },
};

export function getForgotPasswordDictionary(locale: Locale): ForgotPasswordDictionary {
  return forgotPasswordDictionaries[locale];
}
