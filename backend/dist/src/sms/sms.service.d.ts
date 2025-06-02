import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import { SendSmsDto } from './send-sms.dto';
interface Recipient {
    phone: string;
    type: string;
}
export declare class SmsService {
    private prisma;
    private configService;
    private readonly senderNumber;
    constructor(prisma: PrismaService, configService: ConfigService);
    private readonly companies;
    private readonly responsiblePersons;
    getRecipients(packId: number, selectedCompanies: string[], selectedResponsibles: string[]): Promise<Recipient[]>;
    generateMessageText(packId: number): Promise<string>;
    private sendBulkSms;
    sendSms(packId: number, sendSmsDto: SendSmsDto, adminId: number): Promise<any>;
    getSmsReport(packId: number): Promise<{
        successCount: number;
        messages: {
            text: string;
            sentAt: string;
        }[];
    }>;
    getCompaniesAndResponsibles(): {
        companies: string[];
        responsibles: string[];
    };
}
export {};
