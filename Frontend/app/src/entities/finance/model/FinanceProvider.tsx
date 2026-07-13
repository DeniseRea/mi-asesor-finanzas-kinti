'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react';
import { financeApi } from '../api/financeApi';
import { mockFinanceRepository } from '../api/mockFinanceRepository';
import { useAuth } from '@/shared/lib/auth-context';
import type {
  AssistantMessage,
  Budget,
  FinancialSummary,
  NewTransactionInput,
  Notification,
  SupportTicket,
  Transaction,
  UserPreferences,
} from './types';

interface FinanceState {
  transactions: Transaction[];
  previousTransactions: Transaction[];
  budgets: Budget[];
  notifications: Notification[];
  tickets: SupportTicket[];
  messages: AssistantMessage[];
  preferences: UserPreferences;
}

type Action =
  | { type: 'addTransaction'; payload: NewTransactionInput }
  | { type: 'deleteTransaction'; payload: string }
  | { type: 'saveBudget'; payload: Omit<Budget, 'id'> & { id?: string } }
  | { type: 'deleteBudget'; payload: string }
  | { type: 'markNotificationsRead' }
  | { type: 'toggleNotification'; payload: string }
  | { type: 'addMessage'; payload: AssistantMessage }
  | { type: 'createTicket'; payload: Pick<SupportTicket, 'subject' | 'summary' | 'priority'> }
  | { type: 'updatePreferences'; payload: Partial<UserPreferences> }
  | { type: 'loadData'; payload: Partial<FinanceState> };

const greeting: AssistantMessage = {
  id: 'assistant-greeting',
  role: 'assistant',
  text: '¡Hola! Soy tu asistente financiero. ¿En qué puedo ayudarte hoy?',
  createdAt: 'Ahora',
};

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
  previousTransactions: [],
  budgets: [],
  notifications: [],
  tickets: [],
  messages: [greeting],
  preferences: initialPreferences,
};

function reducer(state: FinanceState, action: Action): FinanceState {
  switch (action.type) {
    case 'loadData':
      return { ...state, ...action.payload };
    case 'addTransaction': {
      const transaction: Transaction = {
        ...action.payload,
        id: `demo-transaction-${Date.now()}`,
        date: new Date().toISOString(),
        origin: action.payload.origin ?? 'Manual',
      };
      return { ...state, transactions: [transaction, ...state.transactions] };
    }
    case 'deleteTransaction':
      return { ...state, transactions: state.transactions.filter((item) => item.id !== action.payload) };
    case 'saveBudget': {
      const budget: Budget = { ...action.payload, id: action.payload.id ?? `demo-budget-${Date.now()}` };
      return {
        ...state,
        budgets: action.payload.id
          ? state.budgets.map((item) => (item.id === action.payload.id ? budget : item))
          : [...state.budgets, budget],
      };
    }
    case 'deleteBudget':
      return { ...state, budgets: state.budgets.filter((item) => item.id !== action.payload) };
    case 'markNotificationsRead':
      return { ...state, notifications: state.notifications.map((item) => ({ ...item, read: true })) };
    case 'toggleNotification':
      return {
        ...state,
        notifications: state.notifications.map((item) =>
          item.id === action.payload ? { ...item, read: !item.read } : item,
        ),
      };
    case 'addMessage':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'createTicket':
      return {
        ...state,
        tickets: [
          {
            ...action.payload,
            id: `DEMO-${Date.now()}`,
            status: 'open',
            createdAt: 'Ahora',
            messages: [],
          },
          ...state.tickets,
        ],
      };
    case 'updatePreferences':
      return { ...state, preferences: { ...state.preferences, ...action.payload } };
    default:
      return state;
  }
}

function summarize(transactions: Transaction[], budgets: Budget[]): FinancialSummary {
  const income = transactions
    .filter((item) => item.type === 'income')
    .reduce((total, item) => total + item.amount, 0);
  const expenses = transactions
    .filter((item) => item.type === 'expense')
    .reduce((total, item) => total + item.amount, 0);
  const totalBudget = budgets.reduce((total, item) => total + item.limit, 0);
  return { balance: income - expenses, income, expenses, budgetRemaining: totalBudget - expenses };
}

interface FinanceContextValue extends FinanceState {
  summary: FinancialSummary;
  previousSummary: FinancialSummary;
  expensesByCategory: Record<string, number>;
  isLoading: boolean;
  error: string | null;
  isDemo: boolean;
  dispatch: (action: Action) => Promise<void>;
  formatMoney: (amount: number) => string;
  refresh: () => Promise<void>;
  refreshData: () => Promise<void>;
  sendAssistantMessage: (message: string, file?: File) => Promise<void>;
  parseCsv: typeof financeApi.parseCsv;
  confirmCsv: typeof financeApi.confirmCsv;
  addTicketMessage: (ticketId: string, content: string) => Promise<void>;
}

const FinanceContext = createContext<FinanceContextValue | null>(null);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [state, localDispatch] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const isDemo = user?.id === 'demo-user';

  const refresh = useCallback(async () => {
    if (!user) return;
    if (isDemo) {
      const snapshot = mockFinanceRepository.getSnapshot();
      localDispatch({
        type: 'loadData',
        payload: { ...snapshot, previousTransactions: [], messages: snapshot.messages.length ? snapshot.messages : [greeting] },
      });
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const snapshot = await financeApi.snapshot();
      localDispatch({
        type: 'loadData',
        payload: { ...snapshot, messages: snapshot.messages.length ? snapshot.messages : [greeting] },
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudieron cargar tus datos financieros.');
    } finally {
      setIsLoading(false);
    }
  }, [isDemo, user]);

  useEffect(() => {
    if (!user) {
      localDispatch({ type: 'loadData', payload: initialState });
      return;
    }
    const timeout = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(timeout);
  }, [refresh, user]);

  const dispatch = useCallback(
    async (action: Action) => {
      if (!user) throw new Error('Debes iniciar sesión para realizar esta acción.');
      if (isDemo) {
        localDispatch(action);
        return;
      }

      setError(null);
      try {
        switch (action.type) {
          case 'addTransaction':
            await financeApi.createTransaction(action.payload);
            break;
          case 'deleteTransaction':
            await financeApi.deleteTransaction(action.payload);
            break;
          case 'saveBudget': {
            const existing = state.budgets.find((item) => item.category === action.payload.category);
            await financeApi.saveBudget({ ...action.payload, id: action.payload.id ?? existing?.id });
            break;
          }
          case 'deleteBudget':
            await financeApi.deleteBudget(action.payload);
            break;
          case 'markNotificationsRead':
            await Promise.all(state.notifications.filter((item) => !item.read).map((item) => financeApi.readAlert(item.id)));
            break;
          case 'toggleNotification': {
            const notification = state.notifications.find((item) => item.id === action.payload);
            if (notification && !notification.read) await financeApi.readAlert(notification.id);
            break;
          }
          case 'createTicket':
            await financeApi.createTicket(action.payload);
            break;
          case 'updatePreferences':
            await financeApi.updatePreferences(action.payload);
            break;
          case 'addMessage':
          case 'loadData':
            localDispatch(action);
            return;
        }
        await refresh();
      } catch (caught) {
        const message = caught instanceof Error ? caught.message : 'No se pudo guardar el cambio.';
        setError(message);
        throw caught;
      }
    },
    [isDemo, refresh, state.budgets, state.notifications, user],
  );

  const sendAssistantMessage = useCallback(
    async (message: string, file?: File) => {
      const clean = message.trim().slice(0, 300);
      if (!clean || !user) return;
      localDispatch({
        type: 'addMessage',
        payload: { id: `message-${Date.now()}`, role: 'user', text: clean, createdAt: 'Ahora' },
      });

      if (isDemo) {
        const demoSummary = summarize(state.transactions, state.budgets);
        const reply = `Modo demo: tu saldo es ${new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: state.preferences.currency,
        }).format(demoSummary.balance)}.`;
        localDispatch({
          type: 'addMessage',
          payload: { id: `message-${Date.now()}-reply`, role: 'assistant', text: reply, createdAt: 'Ahora' },
        });
        return;
      }

      const request = await financeApi.sendAi(user.id, clean, file);
      for (let attempt = 0; attempt < 30; attempt += 1) {
        await new Promise((resolve) => window.setTimeout(resolve, 2000));
        const response = await financeApi.aiResponse(request.requestId);
        if (response.status === 'completed' && response.respuesta) {
          localDispatch({
            type: 'addMessage',
            payload: {
              id: `${request.requestId}-assistant`,
              role: 'assistant',
              text: response.respuesta,
              createdAt: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
            },
          });
          await refresh();
          return;
        }
        if (response.status === 'failed') throw new Error(response.error || 'La IA no pudo procesar el mensaje.');
      }
      throw new Error('La IA está tardando demasiado. Intenta nuevamente.');
    },
    [isDemo, refresh, state.budgets, state.preferences.currency, state.transactions, user],
  );

  const parseCsv = useCallback(
    async (csv: string) => {
      if (isDemo) throw new Error('La importación no está disponible en el modo demo.');
      return financeApi.parseCsv(csv);
    },
    [isDemo],
  );

  const confirmCsv = useCallback(
    async (transactions: unknown[]) => {
      if (isDemo) throw new Error('La importación no está disponible en el modo demo.');
      const result = await financeApi.confirmCsv(transactions);
      await refresh();
      return result;
    },
    [isDemo, refresh],
  );

  const addTicketMessage = useCallback(
    async (ticketId: string, content: string) => {
      if (isDemo) throw new Error('El soporte no está disponible en el modo demo.');
      await financeApi.addTicketMessage(ticketId, content);
      await refresh();
    },
    [isDemo, refresh],
  );

  const value = useMemo<FinanceContextValue>(() => {
    const summary = summarize(state.transactions, state.budgets);
    const previousSummary = summarize(state.previousTransactions, []);
    const expensesByCategory = state.transactions
      .filter((item) => item.type === 'expense')
      .reduce<Record<string, number>>((result, item) => {
        result[item.category] = (result[item.category] ?? 0) + item.amount;
        return result;
      }, {});
    const formatMoney = (amount: number) =>
      new Intl.NumberFormat('es-CO', { style: 'currency', currency: state.preferences.currency }).format(amount);

    return {
      ...state,
      summary,
      previousSummary,
      expensesByCategory,
      isLoading,
      error,
      isDemo,
      dispatch,
      formatMoney,
      refresh,
      refreshData: refresh,
      sendAssistantMessage,
      parseCsv,
      confirmCsv,
      addTicketMessage,
    };
  }, [addTicketMessage, confirmCsv, dispatch, error, isDemo, isLoading, parseCsv, refresh, sendAssistantMessage, state]);

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
}
