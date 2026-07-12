import { BarChart3, Bot, CircleHelp, Gauge, PiggyBank, ReceiptText, Settings } from 'lucide-react';

export const navItems = [
  { key: 'home', label: { es: 'Inicio', en: 'Home' }, href: '', icon: Gauge },
  { key: 'movements', label: { es: 'Movimientos', en: 'Transactions' }, href: '/movimientos', icon: ReceiptText },
  { key: 'budgets', label: { es: 'Presupuestos', en: 'Budgets' }, href: '/presupuestos', icon: PiggyBank },
  { key: 'insights', label: { es: 'Insights', en: 'Insights' }, href: '/insights', icon: BarChart3 },
  { key: 'assistant', label: { es: 'Asistente', en: 'Assistant' }, href: '/asistente', icon: Bot },
  { key: 'support', label: { es: 'Soporte', en: 'Support' }, href: '/soporte', icon: CircleHelp },
  { key: 'settings', label: { es: 'Configuración', en: 'Settings' }, href: '/configuracion', icon: Settings },
];
