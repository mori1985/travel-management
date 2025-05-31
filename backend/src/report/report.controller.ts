import { Controller, Get } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportResponseDto } from './report.dto';

@Controller('admin/report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  async getReport(): Promise<ReportResponseDto> {
    const reportData = await this.reportService.getReportData();
    console.log('Sending report data to client:', reportData); // دیباگ
    return reportData;
  }
}