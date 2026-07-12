import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { BudgetsModule } from './modules/budgets/budgets.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { SupportModule } from './modules/support/support.module';
import { KintiModule } from './modules/kinti/kinti.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.dev', '.env'],
    }),
    PrismaModule,
    AuthModule,
    TransactionsModule,
    BudgetsModule,
    AlertsModule,
    SupportModule,
    KintiModule,
  ],
})
export class AppModule {}
