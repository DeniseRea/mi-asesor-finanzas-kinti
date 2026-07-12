export type TransactionType = 'income' | 'expense';
export type TransactionOrigin = 'WhatsApp' | 'Manual' | 'CSV' | 'Assistant';

export interface Transaction {
  id: string;
  description: string;
  merchant: string;
  category: string;
  type: TransactionType;
  amount: number;
  date: string;
  origin: TransactionOrigin;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  threshold: number;
  icon: string;
  color: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  kind: 'alert' | 'income' | 'insight' | 'reminder' | 'update';
  date: string;
  read: boolean;
}

export interface SupportTicket {
  id: string;
  subject: string;
  summary: string;
  status: 'open' | 'review' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  messages: { id: string; author: 'user' | 'support'; text: string; date: string }[];
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: string;
}

export interface UserPreferences {
  currency: string;
  phone: string;
  darkMode: boolean;
  budgetAlerts: boolean;
  movementAlerts: boolean;
  insightAlerts: boolean;
}

export interface FinancialSummary {
  balance: number;
  income: number;
  expenses: number;
  budgetRemaining: number;
}

export interface NewTransactionInput {
  description: string;
  merchant: string;
  category: string;
  type: TransactionType;
  amount: number;
  origin?: TransactionOrigin;
}
