import type { FinanceRepository } from './contracts';
import { initialAssistantMessages, initialBudgets, initialNotifications, initialPreferences, initialTickets, initialTransactions } from '../model/mock-data';

export const mockFinanceRepository: FinanceRepository = {
  getSnapshot: () => ({
    transactions: initialTransactions,
    budgets: initialBudgets,
    notifications: initialNotifications,
    tickets: initialTickets,
    messages: initialAssistantMessages,
    preferences: initialPreferences,
  }),
};
