import type { AssistantMessage, Budget, Notification, SupportTicket, Transaction, UserPreferences } from '../model/types';

export interface FinanceSnapshot {
  transactions: Transaction[];
  budgets: Budget[];
  notifications: Notification[];
  tickets: SupportTicket[];
  messages: AssistantMessage[];
  preferences: UserPreferences;
}

export interface FinanceRepository {
  getSnapshot(): FinanceSnapshot;
}

export interface TransactionsRepository { list(): Promise<Transaction[]>; create(input: Omit<Transaction, 'id' | 'date'>): Promise<Transaction>; remove(id: string): Promise<void> }
export interface BudgetsRepository { list(): Promise<Budget[]>; save(input: Budget): Promise<Budget>; remove(id: string): Promise<void> }
export interface SupportRepository { list(): Promise<SupportTicket[]>; create(input: Pick<SupportTicket, 'subject' | 'summary' | 'priority'>): Promise<SupportTicket> }
