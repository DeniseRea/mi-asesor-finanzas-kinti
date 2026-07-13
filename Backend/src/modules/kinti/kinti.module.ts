import { Module } from '@nestjs/common';
import { KintiController } from './kinti.controller';
import { KintiService } from './kinti.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AlertsModule } from '../alerts/alerts.module';
import { BudgetsModule } from '../budgets/budgets.module';
import { SupportModule } from '../support/support.module';

@Module({
  imports: [PrismaModule, AlertsModule, BudgetsModule, SupportModule],
  controllers: [KintiController],
  providers: [KintiService],
  exports: [KintiService],
})
export class KintiModule {}
