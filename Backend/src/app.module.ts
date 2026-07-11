import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { BudgetsModule } from './modules/budgets/budgets.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { SupportModule } from './modules/support/support.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    TransactionsModule,
    BudgetsModule,
    AlertsModule,
    SupportModule,
  ],
})
export class AppModule {}
