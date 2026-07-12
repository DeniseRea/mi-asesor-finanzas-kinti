'use client';

import { createContext, useContext, useMemo, useReducer, useEffect, type ReactNode } from 'react';
import type { AssistantMessage, Budget, FinancialSummary, NewTransactionInput, Notification, SupportTicket, Transaction, UserPreferences } from './types';
import { mockFinanceRepository } from '../api/mockFinanceRepository';
import { useAuth } from '@/shared/lib/auth-context';
import { apiClient } from '@/shared/api/apiClient';

interface FinanceState {
  transactions: Transaction[];
  budgets: Budget[];
  notifications: Notification[];
  tickets: SupportTicket[];
  messages: AssistantMessage[];
  preferences: UserPreferences;
}

type Action =
  | { type: 'addTransaction'; payload: NewTransactionInput }
  | { type: 'addTransactionReal'; payload: Transaction }
  | { type: 'deleteTransaction'; payload: string }
  | { type: 'saveBudget'; payload: Omit<Budget, 'id'> & { id?: string } }
  | { type: 'saveBudgetReal'; payload: Budget }
  | { type: 'deleteBudget'; payload: string }
  | { type: 'markNotificationsRead' }
  | { type: 'toggleNotification'; payload: string }
  | { type: 'addMessage'; payload: AssistantMessage }
  | { type: 'createTicket'; payload: Pick<SupportTicket, 'subject' | 'summary' | 'priority'> }
  | { type: 'createTicketReal'; payload: SupportTicket }
  | { type: 'updatePreferences'; payload: Partial<UserPreferences> }
  | { type: 'loadData'; payload: Partial<FinanceState> };

const budgetMetadata: Record<string, { icon: string; color: string }> = {
  Comida: { icon: '🍴', color: '#15803d' },
  Transporte: { icon: '🚕', color: '#7c3aed' },
  Servicios: { icon: '🏠', color: '#f59e0b' },
  Entretenimiento: { icon: '🎟️', color: '#f43f5e' },
  Salud: { icon: '♡', color: '#3b82f6' },
  Educación: { icon: '🎓', color: '#f59e0b' },
  Otros: { icon: '•••', color: '#64748b' },
};

const mapTicketStatus = (status: string): 'open' | 'review' | 'resolved' => {
  if (status === 'abierto' || status === 'open') return 'open';
  if (status === 'en_revision' || status === 'review') return 'review';
  if (status === 'resuelto' || status === 'resolved') return 'resolved';
  return 'open';
};

const mapTicketPriority = (priority: string): 'low' | 'medium' | 'high' => {
  if (priority === 'baja' || priority === 'low') return 'low';
  if (priority === 'media' || priority === 'medium') return 'medium';
  if (priority === 'alta' || priority === 'high') return 'high';
  return 'medium';
};

const initialAssistantMessages: AssistantMessage[] = [
  { id: 'am-1', role: 'assistant', text: '¡Hola! Soy tu asistente financiero. ¿En qué puedo ayudarte hoy?', createdAt: 'Ahora' },
];

const initialPreferences: UserPreferences = {
  currency: 'USD',
  phone: '',
  darkMode: false,
  budgetAlerts: true,
  movementAlerts: true,
  insightAlerts: true,
};

const initialState: FinanceState = {
  transactions: [],
  budgets: [],
  notifications: [],
  tickets: [],
  messages: initialAssistantMessages,
  preferences: initialPreferences,
};

function reducer(state: FinanceState, action: Action): FinanceState {
  if (action.type === 'loadData') {
    return { ...state, ...action.payload };
  }
  if (action.type === 'addTransactionReal') {
    return { ...state, transactions: [action.payload, ...state.transactions] };
  }
  if (action.type === 'addTransaction') {
    // Fallback for demo mode
    const transaction: Transaction = {
      ...action.payload,
      id: `mov-${Date.now()}`,
      date: new Date().toISOString(),
      origin: action.payload.origin ?? 'Manual',
    };
    return {
      ...state,
      transactions: [transaction, ...state.transactions],
      notifications: [
        {
          id: `not-${Date.now()}`,
          title: transaction.type === 'income' ? 'Nuevo ingreso registrado' : 'Nuevo gasto registrado',
          description: `${transaction.merchant}: $${transaction.amount.toFixed(2)}`,
          kind: transaction.type === 'income' ? 'income' : 'update',
          date: 'Ahora',
          read: false,
        },
        ...state.notifications,
      ],
    };
  }
  if (action.type === 'deleteTransaction') {
    return { ...state, transactions: state.transactions.filter((item) => item.id !== action.payload) };
  }
  if (action.type === 'saveBudgetReal') {
    const budget = action.payload;
    const exists = state.budgets.some((item) => item.category === budget.category);
    return {
      ...state,
      budgets: exists
        ? state.budgets.map((item) => (item.category === budget.category ? budget : item))
        : [...state.budgets, budget],
    };
  }
  if (action.type === 'saveBudget') {
    // Fallback for demo mode
    const budget: Budget = { ...action.payload, id: action.payload.id ?? `pre-${Date.now()}` };
    return {
      ...state,
      budgets: action.payload.id
        ? state.budgets.map((item) => (item.id === action.payload.id ? budget : item))
        : [...state.budgets, budget],
    };
  }
  if (action.type === 'deleteBudget') {
    return { ...state, budgets: state.budgets.filter((item) => item.id !== action.payload) };
  }
  if (action.type === 'markNotificationsRead') {
    return { ...state, notifications: state.notifications.map((item) => ({ ...item, read: true })) };
  }
  if (action.type === 'toggleNotification') {
    return { ...state, notifications: state.notifications.map((item) => (item.id === action.payload ? { ...item, read: !item.read } : item)) };
  }
  if (action.type === 'addMessage') {
    return { ...state, messages: [...state.messages, action.payload] };
  }
  if (action.type === 'createTicketReal') {
    return { ...state, tickets: [action.payload, ...state.tickets] };
  }
  if (action.type === 'createTicket') {
    // Fallback for demo mode
    return {
      ...state,
      tickets: [
        {
          ...action.payload,
          id: `KNT-${Math.floor(1000 + Math.random() * 8999)}`,
          status: 'open',
          createdAt: 'Ahora',
          messages: [],
        },
        ...state.tickets,
      ],
    };
  }
  if (action.type === 'updatePreferences') {
    return { ...state, preferences: { ...state.preferences, ...action.payload } };
  }
  return state;
}

interface FinanceContextValue extends FinanceState {
  summary: FinancialSummary;
  expensesByCategory: Record<string, number>;
  dispatch: (action: Action) => Promise<void>;
  formatMoney: (amount: number) => string;
}

const FinanceContext = createContext<FinanceContextValue | null>(null);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [state, localDispatch] = useReducer(reducer, initialState);
  const { user } = useAuth();

  // 1. Fetch real backend data on mount or user change
  useEffect(() => {
    if (!user) {
      localDispatch({
        type: 'loadData',
        payload: {
          transactions: [],
          budgets: [],
          notifications: [],
          tickets: [],
          messages: initialAssistantMessages,
          preferences: initialPreferences,
        },
      });
      return;
    }

    if (user.id === 'demo-user') {
      localDispatch({ type: 'loadData', payload: mockFinanceRepository.getSnapshot() });
      return;
    }

    let active = true;

    async function loadBackendData() {
      try {
        const [profile, transactions, budgets, alerts, tickets] = await Promise.all([
          apiClient<any>('/api/auth/profile').catch(() => ({ currency: 'USD', phone: '' })),
          apiClient<any[]>('/api/transactions').catch(() => []),
          apiClient<any[]>('/api/budgets').catch(() => []),
          apiClient<any[]>('/api/alerts').catch(() => []),
          apiClient<any[]>('/api/tickets').catch(() => []),
        ]);

        if (!active) return;

        // Map transactions
        const mappedTransactions: Transaction[] = transactions.map((t) => ({
          id: t.id,
          description: t.descripcion || '',
          merchant: t.entidad || t.descripcion || 'Sin comercio',
          category: t.categoria,
          type: t.accion?.toLowerCase() === 'ingreso' || t.accion === 'income' ? 'income' : 'expense',
          amount: t.monto,
          date: t.fecha,
          origin: 'Manual',
        }));

        // Map budgets
        const mappedBudgets: Budget[] = budgets.map((b) => ({
          id: b.id,
          category: b.category,
          limit: b.amount,
          threshold: b.threshold,
          icon: budgetMetadata[b.category]?.icon ?? '◉',
          color: budgetMetadata[b.category]?.color ?? '#15803d',
        }));

        // Map notifications (alerts)
        const mappedNotifications: Notification[] = alerts.map((a) => ({
          id: a.id,
          title: a.type === 'PRESUPUESTO_EXCEDIDO' ? 'Presupuesto excedido' : 'Alerta de presupuesto',
          description: a.message,
          kind: 'alert' as const,
          date: new Date(a.createdAt).toLocaleString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          read: a.read,
        }));

        // Map tickets
        const mappedTickets: SupportTicket[] = tickets.map((t) => {
          const messages = t.messages?.map((m: any) => ({
            id: m.id,
            author: m.role === 'user' ? ('user' as const) : ('support' as const),
            text: m.content,
            date: new Date(m.createdAt).toLocaleString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          })) || [];

          return {
            id: t.id,
            subject: t.subject,
            summary: t.context || t.subject,
            status: mapTicketStatus(t.status),
            priority: mapTicketPriority(t.priority),
            createdAt: new Date(t.createdAt).toLocaleString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            messages,
          };
        });

        // Map preferences
        const mappedPreferences: UserPreferences = {
          currency: profile.currency || 'USD',
          phone: profile.phone || '',
          darkMode: false,
          budgetAlerts: true,
          movementAlerts: true,
          insightAlerts: true,
        };

        localDispatch({
          type: 'loadData',
          payload: {
            transactions: mappedTransactions,
            budgets: mappedBudgets,
            notifications: mappedNotifications,
            tickets: mappedTickets,
            preferences: mappedPreferences,
          },
        });
      } catch (err) {
        console.error('Failed to load user financial data:', err);
      }
    }

    loadBackendData();

    return () => {
      active = false;
    };
  }, [user]);

  // 2. Custom Dispatch with backend API syncing
  const dispatch = async (action: Action) => {
    const isDemo = !user || user.id === 'demo-user';
    if (isDemo) {
      localDispatch(action);
      return;
    }

    try {
      if (action.type === 'addTransaction') {
        const payload = action.payload;
        const res = await apiClient<{ id: string; fecha: string; confirmado: boolean; created_at: string }>('/api/transactions', {
          method: 'POST',
          body: JSON.stringify({
            accion: payload.type === 'income' ? 'INGRESO' : 'GASTO',
            monto: payload.amount,
            categoria: payload.category,
            entidad: payload.merchant,
            descripcion: payload.description || `Registro ${payload.origin?.toLowerCase() || 'manual'}`,
            fecha: new Date().toISOString().split('T')[0],
          }),
        });

        // Fetch alerts to update notifications list dynamically after a transaction
        const alerts = await apiClient<any[]>('/api/alerts').catch(() => []);
        const mappedNotifications: Notification[] = alerts.map((a) => ({
          id: a.id,
          title: a.type === 'PRESUPUESTO_EXCEDIDO' ? 'Presupuesto excedido' : 'Alerta de presupuesto',
          description: a.message,
          kind: 'alert' as const,
          date: new Date(a.createdAt).toLocaleString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          read: a.read,
        }));

        localDispatch({
          type: 'loadData',
          payload: {
            notifications: mappedNotifications,
          },
        });

        localDispatch({
          type: 'addTransactionReal',
          payload: {
            id: res.id,
            description: payload.description,
            merchant: payload.merchant,
            category: payload.category,
            type: payload.type,
            amount: payload.amount,
            date: res.fecha,
            origin: payload.origin ?? 'Manual',
          },
        });
      }
      else if (action.type === 'deleteTransaction') {
        const id = action.payload;
        await apiClient(`/api/transactions/${id}`, { method: 'DELETE' });
        localDispatch({ type: 'deleteTransaction', payload: id });
      }
      else if (action.type === 'saveBudget') {
        const payload = action.payload;
        const exists = state.budgets.find((item) => item.category === payload.category);
        if (exists) {
          const res = await apiClient<any>(`/api/budgets/${exists.id}`, {
            method: 'PATCH',
            body: JSON.stringify({
              category: payload.category,
              amount: payload.limit,
              threshold: payload.threshold,
              month: new Date().getMonth() + 1,
              year: new Date().getFullYear(),
            }),
          });
          localDispatch({
            type: 'saveBudgetReal',
            payload: {
              id: res.id,
              category: res.category,
              limit: res.amount,
              threshold: res.threshold,
              icon: budgetMetadata[res.category]?.icon ?? '◉',
              color: budgetMetadata[res.category]?.color ?? '#15803d',
            },
          });
        } else {
          const res = await apiClient<any>('/api/budgets', {
            method: 'POST',
            body: JSON.stringify({
              category: payload.category,
              amount: payload.limit,
              threshold: payload.threshold,
              month: new Date().getMonth() + 1,
              year: new Date().getFullYear(),
            }),
          });
          localDispatch({
            type: 'saveBudgetReal',
            payload: {
              id: res.id,
              category: res.category,
              limit: res.amount,
              threshold: res.threshold,
              icon: budgetMetadata[res.category]?.icon ?? '◉',
              color: budgetMetadata[res.category]?.color ?? '#15803d',
            },
          });
        }
      }
      else if (action.type === 'deleteBudget') {
        const id = action.payload;
        await apiClient(`/api/budgets/${id}`, { method: 'DELETE' });
        localDispatch({ type: 'deleteBudget', payload: id });
      }
      else if (action.type === 'markNotificationsRead') {
        const unread = state.notifications.filter((n) => !n.read);
        await Promise.all(unread.map((n) => apiClient(`/api/alerts/${n.id}/read`, { method: 'PATCH' })));
        localDispatch({ type: 'markNotificationsRead' });
      }
      else if (action.type === 'toggleNotification') {
        const id = action.payload;
        const notification = state.notifications.find((n) => n.id === id);
        if (notification && !notification.read) {
          await apiClient(`/api/alerts/${id}/read`, { method: 'PATCH' });
        }
        localDispatch({ type: 'toggleNotification', payload: id });
      }
      else if (action.type === 'createTicket') {
        const payload = action.payload;
        const res = await apiClient<any>('/api/tickets', {
          method: 'POST',
          body: JSON.stringify({
            subject: payload.subject,
            context: payload.summary,
            priority: payload.priority === 'high' ? 'alta' : payload.priority === 'medium' ? 'media' : 'baja',
          }),
        });
        localDispatch({
          type: 'createTicketReal',
          payload: {
            id: res.id,
            subject: res.subject,
            summary: res.context || res.subject,
            status: mapTicketStatus(res.status),
            priority: mapTicketPriority(res.priority),
            createdAt: new Date(res.createdAt).toLocaleString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            messages: [],
          },
        });
      }
      else if (action.type === 'updatePreferences') {
        const payload = action.payload;
        if (payload.currency || payload.phone) {
          await apiClient('/api/auth/profile', {
            method: 'PATCH',
            body: JSON.stringify({
              currency: payload.currency,
              phone: payload.phone,
            }),
          });
        }
        localDispatch({ type: 'updatePreferences', payload });
      }
      else {
        localDispatch(action);
      }
    } catch (err) {
      console.error('Failed to sync state change with backend:', err);
    }
  };

  const value = useMemo(() => {
    const income = state.transactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
    const expenses = state.transactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
    const expensesByCategory = state.transactions.filter((item) => item.type === 'expense').reduce<Record<string, number>>((result, item) => ({ ...result, [item.category]: (result[item.category] ?? 0) + item.amount }), {});
    const totalBudget = state.budgets.reduce((sum, budget) => sum + budget.limit, 0);
    const summary = { balance: income - expenses, income, expenses, budgetRemaining: totalBudget - expenses };
    const formatMoney = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: state.preferences.currency }).format(amount);
    return { ...state, summary, expensesByCategory, dispatch, formatMoney };
  }, [state, dispatch]);

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
}

