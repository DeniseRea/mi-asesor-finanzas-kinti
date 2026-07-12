import type { AssistantMessage, Budget, Notification, SupportTicket, Transaction, UserPreferences } from './types';

export const categories = ['Comida', 'Transporte', 'Servicios', 'Entretenimiento', 'Salud', 'Educación', 'Otros'];

export const initialTransactions: Transaction[] = [
  { id: 'mov-1', description: 'Compra de víveres', merchant: 'Supermercado Santa María', category: 'Comida', type: 'expense', amount: 45.2, date: '2026-07-10T10:30:00', origin: 'Telegram' },
  { id: 'mov-2', description: 'Viaje al trabajo', merchant: 'Uber', category: 'Transporte', type: 'expense', amount: 12.5, date: '2026-07-10T09:15:00', origin: 'Telegram' },
  { id: 'mov-3', description: 'Suscripción mensual', merchant: 'Netflix', category: 'Entretenimiento', type: 'expense', amount: 9.99, date: '2026-07-09T20:00:00', origin: 'Manual' },
  { id: 'mov-4', description: 'Pago de nómina', merchant: 'Salario', category: 'Ingresos', type: 'income', amount: 1500, date: '2026-07-09T09:00:00', origin: 'CSV' },
  { id: 'mov-5', description: 'Cappuccino', merchant: 'Café de la esquina', category: 'Comida', type: 'expense', amount: 4.5, date: '2026-07-08T16:20:00', origin: 'Manual' },
  { id: 'mov-6', description: 'Medicinas', merchant: 'Farmacia Cruz Azul', category: 'Salud', type: 'expense', amount: 23.9, date: '2026-07-08T12:30:00', origin: 'Telegram' },
  { id: 'mov-7', description: 'Pago por diseño', merchant: 'Freelance Project', category: 'Ingresos', type: 'income', amount: 650, date: '2026-07-07T19:45:00', origin: 'Manual' },
  { id: 'mov-8', description: 'Factura de electricidad', merchant: 'Empresa Eléctrica', category: 'Servicios', type: 'expense', amount: 145, date: '2026-07-06T14:00:00', origin: 'CSV' },
  { id: 'mov-9', description: 'Cena familiar', merchant: 'La Terraza', category: 'Comida', type: 'expense', amount: 360.3, date: '2026-07-05T20:10:00', origin: 'Manual' },
  { id: 'mov-10', description: 'Internet hogar', merchant: 'Netlife', category: 'Servicios', type: 'expense', amount: 55, date: '2026-07-04T08:00:00', origin: 'CSV' },
  { id: 'mov-11', description: 'Curso online', merchant: 'Platzi', category: 'Educación', type: 'expense', amount: 60, date: '2026-07-03T18:00:00', origin: 'Manual' },
  { id: 'mov-12', description: 'Ingreso adicional', merchant: 'Consultoría', category: 'Ingresos', type: 'income', amount: 1100, date: '2026-07-02T11:00:00', origin: 'Manual' },
];

export const initialBudgets: Budget[] = [
  { id: 'pre-1', category: 'Comida', limit: 500, threshold: 80, icon: '🍴', color: '#15803d' },
  { id: 'pre-2', category: 'Transporte', limit: 300, threshold: 80, icon: '🚕', color: '#7c3aed' },
  { id: 'pre-3', category: 'Servicios', limit: 250, threshold: 80, icon: '🏠', color: '#f59e0b' },
  { id: 'pre-4', category: 'Entretenimiento', limit: 150, threshold: 80, icon: '🎟️', color: '#f43f5e' },
  { id: 'pre-5', category: 'Salud', limit: 100, threshold: 80, icon: '♡', color: '#3b82f6' },
  { id: 'pre-6', category: 'Educación', limit: 150, threshold: 80, icon: '🎓', color: '#f59e0b' },
  { id: 'pre-7', category: 'Otros', limit: 400, threshold: 80, icon: '•••', color: '#64748b' },
];

export const initialNotifications: Notification[] = [
  { id: 'not-1', title: 'Presupuesto cerca del límite', description: 'Has utilizado más del 80% de tu presupuesto de Comida.', kind: 'alert', date: 'Hoy, 10:30', read: false },
  { id: 'not-2', title: 'Nuevo ingreso registrado', description: 'Se registró un ingreso de $1,500.00.', kind: 'income', date: 'Hoy, 9:15', read: false },
  { id: 'not-3', title: 'Insight disponible', description: 'Descubre cómo cambiaron tus gastos en transporte.', kind: 'insight', date: 'Ayer, 6:45', read: false },
  { id: 'not-4', title: 'Resumen semanal listo', description: 'Tu resumen financiero semanal ya está disponible.', kind: 'update', date: 'Ayer, 12:00', read: true },
];

export const initialTickets: SupportTicket[] = [
  { id: 'KNT-2487', subject: 'Problema al importar CSV', summary: 'El archivo del banco contiene filas que no se reconocen.', status: 'review', priority: 'medium', createdAt: '8 Jul 2026, 10:24', messages: [
    { id: 'tm-1', author: 'user', text: 'Mi archivo no termina de importarse.', date: '8 Jul, 10:24' },
    { id: 'tm-2', author: 'support', text: 'Estamos revisando el formato y te avisaremos pronto.', date: '8 Jul, 11:05' },
  ] },
];

export const initialAssistantMessages: AssistantMessage[] = [
  { id: 'am-1', role: 'assistant', text: '¡Hola! Soy tu asistente financiero. ¿En qué puedo ayudarte hoy?', createdAt: '10:30' },
];

export const initialPreferences: UserPreferences = { currency: 'USD', phone: '', darkMode: false, budgetAlerts: true, movementAlerts: true, insightAlerts: true };
