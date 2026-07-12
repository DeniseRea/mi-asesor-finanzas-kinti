'use client';

import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';
import type { AssistantMessage, Budget, FinancialSummary, NewTransactionInput, Notification, SupportTicket, Transaction, UserPreferences } from './types';
import { mockFinanceRepository } from '../api/mockFinanceRepository';

interface FinanceState { transactions: Transaction[]; budgets: Budget[]; notifications: Notification[]; tickets: SupportTicket[]; messages: AssistantMessage[]; preferences: UserPreferences }
type Action =
  | { type: 'addTransaction'; payload: NewTransactionInput }
  | { type: 'deleteTransaction'; payload: string }
  | { type: 'saveBudget'; payload: Omit<Budget, 'id'> & { id?: string } }
  | { type: 'deleteBudget'; payload: string }
  | { type: 'markNotificationsRead' }
  | { type: 'toggleNotification'; payload: string }
  | { type: 'addMessage'; payload: AssistantMessage }
  | { type: 'createTicket'; payload: Pick<SupportTicket, 'subject' | 'summary' | 'priority'> }
  | { type: 'updatePreferences'; payload: Partial<UserPreferences> };

const initialState: FinanceState = mockFinanceRepository.getSnapshot();

function reducer(state: FinanceState, action: Action): FinanceState {
  if (action.type === 'addTransaction') {
    const transaction: Transaction = { ...action.payload, id: `mov-${Date.now()}`, date: new Date().toISOString(), origin: action.payload.origin ?? 'Manual' };
    return { ...state, transactions: [transaction, ...state.transactions], notifications: [{ id: `not-${Date.now()}`, title: transaction.type === 'income' ? 'Nuevo ingreso registrado' : 'Nuevo gasto registrado', description: `${transaction.merchant}: $${transaction.amount.toFixed(2)}`, kind: transaction.type === 'income' ? 'income' : 'update', date: 'Ahora', read: false }, ...state.notifications] };
  }
  if (action.type === 'deleteTransaction') return { ...state, transactions: state.transactions.filter((item) => item.id !== action.payload) };
  if (action.type === 'saveBudget') {
    const budget: Budget = { ...action.payload, id: action.payload.id ?? `pre-${Date.now()}` };
    return { ...state, budgets: action.payload.id ? state.budgets.map((item) => item.id === action.payload.id ? budget : item) : [...state.budgets, budget] };
  }
  if (action.type === 'deleteBudget') return { ...state, budgets: state.budgets.filter((item) => item.id !== action.payload) };
  if (action.type === 'markNotificationsRead') return { ...state, notifications: state.notifications.map((item) => ({ ...item, read: true })) };
  if (action.type === 'toggleNotification') return { ...state, notifications: state.notifications.map((item) => item.id === action.payload ? { ...item, read: !item.read } : item) };
  if (action.type === 'addMessage') return { ...state, messages: [...state.messages, action.payload] };
  if (action.type === 'createTicket') return { ...state, tickets: [{ ...action.payload, id: `KNT-${Math.floor(1000 + Math.random() * 8999)}`, status: 'open', createdAt: 'Ahora', messages: [] }, ...state.tickets] };
  if (action.type === 'updatePreferences') return { ...state, preferences: { ...state.preferences, ...action.payload } };
  return state;
}

interface FinanceContextValue extends FinanceState {
  summary: FinancialSummary;
  expensesByCategory: Record<string, number>;
  dispatch: React.Dispatch<Action>;
  formatMoney: (amount: number) => string;
}

const FinanceContext = createContext<FinanceContextValue | null>(null);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => {
    const income = state.transactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
    const expenses = state.transactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
    const expensesByCategory = state.transactions.filter((item) => item.type === 'expense').reduce<Record<string, number>>((result, item) => ({ ...result, [item.category]: (result[item.category] ?? 0) + item.amount }), {});
    const totalBudget = state.budgets.reduce((sum, budget) => sum + budget.limit, 0);
    const summary = { balance: income - expenses, income, expenses, budgetRemaining: totalBudget - expenses };
    const formatMoney = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: state.preferences.currency }).format(amount);
    return { ...state, summary, expensesByCategory, dispatch, formatMoney };
  }, [state]);
  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
}
