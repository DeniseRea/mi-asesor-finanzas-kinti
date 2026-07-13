import { apiClient } from '@/shared/api/apiClient';
import type { AssistantMessage, Budget, Notification, SupportTicket, Transaction, UserPreferences } from '../model/types';

type ApiTransaction = { id: string; accion: string; monto: number; categoria: string; entidad?: string; fecha: string; descripcion?: string; created_at: string };
type ApiBudget = { id: string; category: string; amount: number; threshold: number; month: number; year: number };
type ApiAlert = { id: string; type: string; message: string; read: boolean; createdAt: string };
type ApiTicket = { id: string; subject: string; context?: string; status: string; priority: string; createdAt: string; messages?: { id: string; role: string; content: string; createdAt: string }[] };
type ApiProfile = { currency?: string; phone?: string; darkMode?: boolean; budgetAlerts?: boolean; movementAlerts?: boolean; insightAlerts?: boolean };
type ApiAiHistory = { id: string; message?: string; status: string; responseText?: string; createdAt: string; completedAt?: string };

const metadata: Record<string, { icon: string; color: string }> = {
  Comida: { icon: '🍴', color: '#15803d' }, Transporte: { icon: '🚕', color: '#7c3aed' }, Servicios: { icon: '🏠', color: '#f59e0b' }, Entretenimiento: { icon: '🎟️', color: '#f43f5e' }, Salud: { icon: '♡', color: '#3b82f6' }, Educación: { icon: '🎓', color: '#f59e0b' }, Otros: { icon: '•••', color: '#64748b' },
};

export function periodBounds(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const next = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  const previous = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  const iso = (value: Date) => `${value.getFullYear()}-${String(value.getMonth()+1).padStart(2,'0')}-${String(value.getDate()).padStart(2,'0')}`;
  return { month: date.getMonth() + 1, year: date.getFullYear(), currentFrom: iso(start), currentTo: iso(new Date(next.getTime() - 1)), previousFrom: iso(previous), previousTo: iso(new Date(start.getTime() - 1)) };
}

const transaction = (item: ApiTransaction): Transaction => ({ id: item.id, description: item.descripcion ?? '', merchant: item.entidad ?? item.descripcion ?? 'Sin descripción', category: item.categoria, type: item.accion.toUpperCase() === 'INGRESO' ? 'income' : 'expense', amount: item.monto, date: item.fecha, origin: 'Manual' });
const budget = (item: ApiBudget): Budget => ({ id: item.id, category: item.category, limit: item.amount, threshold: item.threshold, icon: metadata[item.category]?.icon ?? '◉', color: metadata[item.category]?.color ?? '#15803d' });
const ticket = (item: ApiTicket): SupportTicket => ({ id: item.id, subject: item.subject, summary: item.context ?? item.subject, status: item.status === 'resuelto' ? 'resolved' : item.status === 'abierto' ? 'open' : 'review', priority: item.priority === 'alta' ? 'high' : item.priority === 'baja' ? 'low' : 'medium', createdAt: new Date(item.createdAt).toLocaleString(), messages: (item.messages ?? []).map((message) => ({ id: message.id, author: message.role === 'user' ? 'user' : 'support', text: message.content, date: new Date(message.createdAt).toLocaleString() })) });

export const financeApi = {
  async snapshot() {
    const p = periodBounds();
    const [profile, current, previous, budgets, alerts, ticketList, history] = await Promise.all([
      apiClient<ApiProfile>('/api/auth/profile'),
      apiClient<ApiTransaction[]>(`/api/transactions?from=${p.currentFrom}&to=${p.currentTo}`),
      apiClient<ApiTransaction[]>(`/api/transactions?from=${p.previousFrom}&to=${p.previousTo}`),
      apiClient<ApiBudget[]>(`/api/budgets?month=${p.month}&year=${p.year}`),
      apiClient<ApiAlert[]>('/api/alerts'), apiClient<ApiTicket[]>('/api/tickets'), apiClient<ApiAiHistory[]>('/api/kinti/historial'),
    ]);
    const tickets = await Promise.all(ticketList.map((item) => apiClient<ApiTicket>(`/api/tickets/${item.id}`).then(ticket)));
    const messages: AssistantMessage[] = history.flatMap((item) => [
      ...(item.message ? [{ id: `${item.id}-user`, role: 'user' as const, text: item.message, createdAt: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }] : []),
      ...(item.responseText ? [{ id: `${item.id}-assistant`, role: 'assistant' as const, text: item.responseText, createdAt: new Date(item.completedAt ?? item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }] : []),
    ]);
    return {
      transactions: current.map(transaction), previousTransactions: previous.map(transaction), budgets: budgets.map(budget), tickets, messages,
      notifications: alerts.map<Notification>((item) => ({ id: item.id, title: item.type === 'PRESUPUESTO_EXCEDIDO' ? 'Alerta de presupuesto' : item.type, description: item.message, kind: 'alert', date: new Date(item.createdAt).toLocaleString(), read: item.read })),
      preferences: { currency: profile.currency ?? 'USD', phone: profile.phone ?? '', darkMode: profile.darkMode ?? false, budgetAlerts: profile.budgetAlerts ?? true, movementAlerts: profile.movementAlerts ?? true, insightAlerts: profile.insightAlerts ?? true } satisfies UserPreferences,
    };
  },
  createTransaction(input: { type: string; amount: number; category: string; merchant: string; description: string }) { return apiClient<ApiTransaction>('/api/transactions', { method: 'POST', body: JSON.stringify({ accion: input.type === 'income' ? 'INGRESO' : 'GASTO', monto: input.amount, categoria: input.category, entidad: input.merchant, descripcion: input.description, fecha: new Date().toISOString().slice(0, 10) }) }).then(transaction); },
  deleteTransaction(id: string) { return apiClient(`/api/transactions/${id}`, { method: 'DELETE' }); },
  saveBudget(input: { id?: string; category: string; limit: number; threshold: number }) { const p = periodBounds(); return apiClient<ApiBudget>(input.id ? `/api/budgets/${input.id}` : '/api/budgets', { method: input.id ? 'PATCH' : 'POST', body: JSON.stringify({ category: input.category, amount: input.limit, threshold: input.threshold, month: p.month, year: p.year }) }).then(budget); },
  deleteBudget(id: string) { return apiClient(`/api/budgets/${id}`, { method: 'DELETE' }); },
  readAlert(id: string) { return apiClient(`/api/alerts/${id}/read`, { method: 'PATCH' }); },
  createTicket(input: { subject: string; summary: string; priority: string }) { return apiClient<ApiTicket>('/api/tickets', { method: 'POST', body: JSON.stringify({ subject: input.subject, context: input.summary, priority: input.priority === 'high' ? 'alta' : input.priority === 'low' ? 'baja' : 'media' }) }).then(ticket); },
  addTicketMessage(id: string, content: string) { return apiClient(`/api/tickets/${id}/messages`, { method: 'POST', body: JSON.stringify({ role: 'user', content }) }); },
  updatePreferences(input: Partial<UserPreferences>) { return apiClient('/api/auth/profile', { method: 'PATCH', body: JSON.stringify(input) }); },
  parseCsv(csv: string) { return apiClient<{ valid: unknown[]; errors: unknown[]; valid_count: number; error_count: number }>('/api/transactions/csv', { method: 'POST', body: JSON.stringify({ csv }) }); },
  confirmCsv(transactions: unknown[]) { return apiClient('/api/transactions/csv/confirm', { method: 'POST', body: JSON.stringify({ transactions }) }); },
  async sendAi(userId: string, message: string, file?: File) { const form = new FormData(); form.append('usuario_id', userId); form.append('mensaje', message); if (file) form.append('file', file); return apiClient<{ requestId: string; status: string }>('/api/kinti/procesar', { method: 'POST', body: form }); },
  aiResponse(requestId: string) { return apiClient<{ status: string; respuesta?: string; error?: string }>(`/api/kinti/respuesta?requestId=${encodeURIComponent(requestId)}`); },
  exportAccount() { return apiClient<Record<string, unknown>>('/api/auth/export'); },
  deleteAccount() { return apiClient<{ deleted: boolean }>('/api/auth/delete-account', { method: 'POST' }); },
  knowledgeBase() { return apiClient<{ id: string; title: string; content: string; category: string }[]>('/api/knowledge-base'); },
};
