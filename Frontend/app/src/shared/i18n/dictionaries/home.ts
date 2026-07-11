import type { Locale } from '../config';

export interface HomeDictionary {
  title: string;
  subtitle: string;
  description: string;
  startFree: string;
  viewDemo: string;
}

const homeDictionaries: Record<Locale, HomeDictionary> = {
  es: {
    title: 'Mi Asesor Finanzas Kinti',
    subtitle: 'Asistencia Financiera Inteligente',
    description: 'Toma el control absoluto de tus finanzas personales con análisis predictivos, presupuestos dinámicos y recomendaciones personalizadas impulsadas por IA.',
    startFree: 'Comenzar Gratis',
    viewDemo: 'Ver Demo',
  },
  en: {
    title: 'My Kinti Finance Advisor',
    subtitle: 'Smart Financial Assistance',
    description: 'Take absolute control of your personal finances with predictive analysis, dynamic budgets, and personalized recommendations powered by AI.',
    startFree: 'Start Free',
    viewDemo: 'View Demo',
  },
};

export function getHomeDictionary(locale: Locale): HomeDictionary {
  return homeDictionaries[locale];
}
