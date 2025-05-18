import { Module } from '@nestjs/common';
import { FinalConfirmationService } from './final-confirmation.service';
import { FinalConfirmationController } from './final-confirmation.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [FinalConfirmationController],
  providers: [FinalConfirmationService, PrismaService],
})
export class FinalConfirmationModule {}