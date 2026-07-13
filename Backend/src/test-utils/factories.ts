import { faker } from '@faker-js/faker';

export function createUser(overrides = {}) {
  return {
    id: 'user-test-id',
    name: 'Test User',
    email: 'test@test.com',
    password: '$2b$10$hashedpassword',
    phone: null,
    currency: 'USD',
    emailVerified: true,
    verificationCode: null,
    verificationExpires: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function createTransaction(overrides = {}) {
  return {
    id: 'tx-test-id',
    userId: 'user-test-id',
    amount: 100,
    type: 'GASTO',
    category: 'comida',
    entity: 'Restaurante',
    date: new Date(),
    description: 'Test transaction',
    confirmed: true,
    createdAt: new Date(),
    ...overrides,
  };
}

export function createBudget(overrides = {}) {
  return {
    id: 'budget-test-id',
    userId: 'user-test-id',
    category: 'comida',
    amount: 500,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    threshold: 80,
    createdAt: new Date(),
    ...overrides,
  };
}

export function createAlert(overrides = {}) {
  return {
    id: 'alert-test-id',
    userId: 'user-test-id',
    budgetId: 'budget-test-id',
    type: 'PRESUPUESTO_EXCEDIDO',
    message: 'Alerta de prueba',
    read: false,
    createdAt: new Date(),
    budget: createBudget(),
    ...overrides,
  };
}
