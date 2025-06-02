import { Controller, Get } from '@nestjs/common';
import { SmsReportService } from './sms-report.service';

@Controller('sms-detailed-report')
export class SmsReportController {
  constructor(private readonly smsReportService: SmsReportService) {}

  @Get()
  async getSmsDetailedReport() {
    return this.smsReportService.getSmsDetailedReport();
  }
}