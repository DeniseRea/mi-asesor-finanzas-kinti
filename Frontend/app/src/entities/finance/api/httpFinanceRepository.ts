import type { FinanceRepository } from './contracts';

export const httpFinanceRepository: FinanceRepository = {
  getSnapshot() {
    throw new Error('El adaptador HTTP se habilitará cuando los endpoints financieros estén disponibles.');
  },
};
