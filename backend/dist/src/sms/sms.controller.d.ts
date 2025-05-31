import { SmsService } from './sms.service';
import { SendSmsDto } from './send-sms.dto';
export declare class SmsController {
    private readonly smsService;
    constructor(smsService: SmsService);
    sendSms(packId: number, sendSmsDto: SendSmsDto): Promise<any>;
    getSmsReport(packId: number): Promise<{
        count: number;
        messages: any[];
    }>;
    getCompaniesAndResponsibles(): {
        companies: string[];
        responsibles: string[];
    };
    getDefaultMessage(packId: number): Promise<{
        messageText: string;
    }>;
}
