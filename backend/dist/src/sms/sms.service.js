"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma.service");
const request = require('request');
let SmsService = class SmsService {
    prisma;
    configService;
    senderNumber;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        const apiKey = this.configService.get('GHASEDAK_API_KEY');
        console.log('GHASEDAK_API_KEY:', apiKey);
        if (!apiKey) {
            throw new Error('GHASEDAK_API_KEY is not defined in environment variables');
        }
        this.senderNumber = '30006703337085';
    }
    companies = [
        { name: 'ایران‌پیما', phone: '09120000001' },
        { name: 'هما', phone: '09120000002' },
    ];
    responsiblePersons = [
        { name: 'علی محمدی', phone: '09123456789' },
        { name: 'رضا احمدی', phone: '09129876543' },
    ];
    async getRecipients(packId, selectedCompanies, selectedResponsibles) {
        const recipients = [];
        const passengers = await this.prisma.passenger.findMany({
            where: { packId },
            select: { phone: true },
        });
        passengers.forEach((passenger) => {
            if (passenger.phone) {
                recipients.push({ phone: passenger.phone, type: 'passenger' });
            }
        });
        const busAssignment = await this.prisma.busAssignment.findFirst({
            where: { packId },
            select: { driverPhone: true },
        });
        if (busAssignment?.driverPhone) {
            recipients.push({ phone: busAssignment.driverPhone, type: 'driver' });
        }
        const companies = this.companies.filter((company) => selectedCompanies.includes(company.name));
        companies.forEach((company) => {
            recipients.push({ phone: company.phone, type: 'company' });
        });
        const responsibles = this.responsiblePersons.filter((person) => selectedResponsibles.includes(person.name));
        responsibles.forEach((person) => {
            recipients.push({ phone: person.phone, type: 'responsible' });
        });
        return recipients;
    }
    async generateMessageText(packId) {
        const pack = await this.prisma.pack.findUnique({
            where: { id: packId },
            select: { travelDate: true, type: true },
        });
        const busAssignment = await this.prisma.busAssignment.findFirst({
            where: { packId },
            select: { plate: true },
        });
        const finalConfirmation = await this.prisma.finalConfirmation.findFirst({
            where: { packId },
            select: { company: true },
        });
        const travelDate = pack?.travelDate
            ? new Date(pack.travelDate).toLocaleDateString('fa-IR')
            : 'نامشخص';
        const plate = busAssignment?.plate || 'نامشخص';
        const company = finalConfirmation?.company || 'نامشخص';
        const travelType = pack?.type === 'vip' ? 'VIP' : 'عادی';
        return `مسافر گرامی تاریخ سفر شما ${travelDate} با اتوبوس به شماره پلاک ${plate} با ${company} نوع اتوبوس ${travelType} می‌باشد لذا برای نهایی کردن سفر خود تا 24 ساعت آینده به پایانه مسافربری قزوین ${company} مراجعه نمایید.`;
    }
    async sendSingleSms(packId, recipient, messageText, adminId) {
        const apiKey = this.configService.get('GHASEDAK_API_KEY');
        const options = {
            method: 'POST',
            url: 'http://api.ghasedaksms.com/v2/sms/send/simple',
            headers: { apikey: apiKey },
            form: {
                message: messageText,
                sender: this.senderNumber,
                receptor: recipient.phone,
            },
        };
        try {
            const { response, body } = await new Promise((resolve, reject) => {
                request(options, (error, response, body) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve({ response, body });
                    }
                });
            });
            const parsedBody = JSON.parse(body);
            console.log('پاسخ قاصدک:', parsedBody);
            let status = 'failed';
            let errorMessage = null;
            if (parsedBody.result === 'success' && parsedBody.messageids > 1000) {
                status = 'success';
            }
            else {
                errorMessage = parsedBody.message || `خطا از قاصدک: کد ${parsedBody.messageids}`;
            }
            await this.prisma.smsHistory.create({
                data: {
                    packId,
                    recipientPhone: recipient.phone,
                    recipientType: recipient.type,
                    text: messageText,
                    sentAt: new Date(),
                    status,
                    error: errorMessage,
                    createdBy: adminId,
                },
            });
            if (status === 'failed') {
                throw new Error(errorMessage || 'خطا در ارسال پیامک');
            }
            return { recipient, status: 'success', response: parsedBody };
        }
        catch (error) {
            console.error(`خطا در ارسال به ${recipient.phone}:`, error.message);
            await this.prisma.smsHistory.create({
                data: {
                    packId,
                    recipientPhone: recipient.phone,
                    recipientType: recipient.type,
                    text: messageText,
                    sentAt: new Date(),
                    status: 'failed',
                    error: error.message,
                    createdBy: adminId,
                },
            });
            throw error;
        }
    }
    async sendTestSms(packId, testPhone, messageText, adminId) {
        const recipient = { phone: testPhone, type: 'test' };
        return this.sendSingleSms(packId, recipient, messageText, adminId);
    }
    async sendSms(packId, sendSmsDto, adminId) {
        throw new Error('ارسال پیامک به همه اشخاص فعلاً غیرفعال است. لطفاً از دکمه تست استفاده کنید.');
    }
    async getSmsReport(packId) {
        const messages = await this.prisma.smsHistory.findMany({
            where: { packId },
            orderBy: { sentAt: 'desc' },
        });
        const count = messages.length;
        return { count, messages };
    }
    getCompaniesAndResponsibles() {
        return {
            companies: this.companies.map((company) => company.name),
            responsibles: this.responsiblePersons.map((person) => person.name),
        };
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], SmsService);
//# sourceMappingURL=sms.service.js.map