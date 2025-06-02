import { SmsReportService } from './sms-report.service';
export declare class SmsReportController {
    private readonly smsReportService;
    constructor(smsReportService: SmsReportService);
    getSmsDetailedReport(): Promise<any[]>;
}
