import { Module } from '@nestjs/common';
import { SmsReportService } from './sms-report.service';
import { SmsReportController } from './sms-report.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [SmsReportController],
  providers: [SmsReportService, PrismaService],
})
export class SmsReportModule {}