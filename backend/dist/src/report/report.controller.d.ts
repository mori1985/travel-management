import { ReportService } from './report.service';
import { ReportResponseDto } from './report.dto';
export declare class ReportController {
    private readonly reportService;
    constructor(reportService: ReportService);
    getReport(): Promise<ReportResponseDto>;
}
