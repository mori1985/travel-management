import { PrismaService } from '../prisma.service';
export declare class SmsReportService {
    private prisma;
    constructor(prisma: PrismaService);
    getSmsDetailedReport(): Promise<any[]>;
    private formatDate;
    private mapSmsStatus;
}
