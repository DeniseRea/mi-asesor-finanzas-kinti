'use client';

import { AuthProvider } from '@/shared/lib/auth-context';
import { FinanceProvider } from '@/entities/finance/model/FinanceProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider><FinanceProvider>{children}</FinanceProvider></AuthProvider>;
}
