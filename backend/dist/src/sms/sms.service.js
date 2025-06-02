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
        { name: 'علی محمدی', phone: '09120961862' },
        { name: 'رضا احمدی', phone: '09391872895' },
        { name: 'حسن رضایی', phone: '09127654321' },
        { name: 'محمد حسینی', phone: '09121234567' },
        { name: 'سعید کریمی', phone: '09122345678' },
        { name: 'مهدی موسوی', phone: '09123467890' },
        { name: 'علی اکبری', phone: '09124567890' },
        { name: 'رضا جعفری', phone: '09125678901' },
        { name: 'حسین علوی', phone: '09126789012' },
        { name: 'امیر قاسمی', phone: '09127890123' },
    ];
    async getRecipients(packId, selectedCompanies, selectedResponsibles) {
        const recipients = [];
        const pack = await this.prisma.pack.findUnique({
            where: { id: packId },
            select: { type: true },
        });
        const isVip = pack?.type === 'vip';
        const passengerLimit = isVip ? 25 : 40;
        const passengers = await this.prisma.passenger.findMany({
            where: { packId },
            select: { phone: true },
            take: passengerLimit,
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
        console.log('Raw travelDate from database:', pack?.travelDate);
        const travelDate = pack?.travelDate?.toISOString().split('T')[0] || 'نامشخص';
        console.log('Formatted travelDate:', travelDate);
        const plate = busAssignment?.plate || 'نامشخص';
        const company = finalConfirmation?.company || 'نامشخص';
        const travelType = pack?.type === 'vip' ? 'VIP' : 'عادی';
        const messageText = `مسافر گرامی سلام\nتاریخ سفر شما: ${travelDate}\nشماره پلاک اتوبوس: ${plate}\nشرکت مسافربری: ${company}\nنوع اتوبوس: ${travelType}\nلذا برای نهایی کردن سفر خود تا 24 ساعت آینده به پایانه مسافربری قزوین شرکت ${company} مراجعه نمایید.`;
        console.log('Final messageText:', messageText);
        return messageText;
    }
    async sendBulkSms(packId, recipients, messageText, adminId) {
        const apiKey = this.configService.get('GHASEDAK_API_KEY');
        const receptorList = recipients.map((r) => r.phone).join(',');
        const options = {
            method: 'POST',
            url: 'http://api.ghasedaksms.com/v2/sms/send/bulk',
            headers: { apikey: apiKey },
            form: {
                message: messageText,
                sender: this.senderNumber,
                receptor: receptorList,
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
            let status = 'failed';
            let errorMessage = null;
            if (parsedBody.result === 'success') {
                const messageIds = parsedBody.messageids.split(',').map((id) => parseInt(id.trim()));
                const allIdsValid = messageIds.every((id) => id > 1000);
                if (allIdsValid) {
                    status = 'success';
                }
                else {
                    errorMessage = `شناسه‌های پیامک نامعتبر: ${parsedBody.messageids}`;
                }
            }
            else {
                errorMessage = parsedBody.message || `خطا از قاصدک: کد ${parsedBody.messageids}`;
            }
            const smsRecords = recipients.map((recipient) => ({
                packId,
                recipientPhone: recipient.phone,
                recipientType: recipient.type,
                text: messageText,
                sentAt: new Date(),
                status: status,
                error: status === 'failed' ? errorMessage : null,
                createdBy: adminId,
            }));
            await this.prisma.smsHistory.createMany({
                data: smsRecords,
            });
            if (status === 'failed') {
                throw new Error(errorMessage || 'خطا در ارسال پیامک انبوه');
            }
            return { recipients, status: 'success', response: parsedBody };
        }
        catch (error) {
            console.error('خطا در ارسال پیامک انبوه:', error.message);
            const smsRecords = recipients.map((recipient) => ({
                packId,
                recipientPhone: recipient.phone,
                recipientType: recipient.type,
                text: messageText,
                sentAt: new Date(),
                status: 'failed',
                error: error.message,
                createdBy: adminId,
            }));
            await this.prisma.smsHistory.createMany({
                data: smsRecords,
            });
            throw error;
        }
    }
    async sendSms(packId, sendSmsDto, adminId) {
        const { selectedCompanies, selectedResponsibles, messageText } = sendSmsDto;
        const recipients = await this.getRecipients(packId, selectedCompanies, selectedResponsibles);
        if (recipients.length === 0) {
            throw new common_1.HttpException('هیچ گیرنده‌ای برای ارسال پیامک پیدا نشد.', common_1.HttpStatus.BAD_REQUEST);
        }
        const result = await this.sendBulkSms(packId, recipients, messageText, adminId);
        return {
            message: 'پیامک با موفقیت ارسال شد.',
            successCount: recipients.length,
            recipients,
        };
    }
    async getSmsReport(packId) {
        const messages = await this.prisma.smsHistory.findMany({
            where: {
                packId,
                status: 'success',
            },
            select: {
                text: true,
                sentAt: true,
            },
            orderBy: { sentAt: 'desc' },
            take: 1,
        });
        const successCount = await this.prisma.smsHistory.count({
            where: {
                packId,
                status: 'success',
            },
        });
        const formattedMessages = messages.map((msg) => ({
            text: msg.text,
            sentAt: new Date(msg.sentAt).toLocaleString('fa-IR'),
        }));
        return { successCount, messages: formattedMessages };
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