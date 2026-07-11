import type { Locale } from '../config';

export interface DashboardDictionary {
  title: string;
  subtitle: string;
  revenue: string;
  stats: {
    balance: string;
    expenses: string;
    savings: string;
  };
}

const dashboardDictionaries: Record<Locale, DashboardDictionary> = {
  es: {
    title: 'Panel de Control',
    subtitle: 'Vista general de tus finanzas',
    revenue: 'Ingresos mensuales',
    stats: {
      balance: 'Balance Total',
      expenses: 'Gastos',
      savings: 'Ahorros',
    },
  },
  en: {
    title: 'Dashboard',
    subtitle: 'Overview of your finances',
    revenue: 'Monthly revenue',
    stats: {
      balance: 'Total Balance',
      expenses: 'Expenses',
      savings: 'Savings',
    },
  },
};

export function getDashboardDictionary(locale: Locale): DashboardDictionary {
  return dashboardDictionaries[locale];
}
