import { PrismaService } from '../prisma.service';
import { ReportResponseDto } from './report.dto';
export declare class ReportService {
    private prisma;
    constructor(prisma: PrismaService);
    getReportData(): Promise<ReportResponseDto>;
}
