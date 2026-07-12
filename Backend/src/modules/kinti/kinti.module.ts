import { Module } from '@nestjs/common';
import { KintiController } from './kinti.controller';
import { KintiService } from './kinti.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [KintiController],
  providers: [KintiService],
  exports: [KintiService],
})
export class KintiModule {}
