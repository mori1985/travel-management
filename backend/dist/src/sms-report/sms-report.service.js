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
exports.SmsReportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let SmsReportService = class SmsReportService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSmsDetailedReport() {
        try {
            const packs = await this.prisma.finalConfirmation.findMany({
                include: {
                    pack: {
                        include: {
                            passengers: true,
                            smsHistory: true,
                        },
                    },
                    busAssignment: true,
                },
            });
            const formattedPacks = packs.map((fc) => {
                const smsStatusMap = {};
                fc.pack.smsHistory.forEach((sms) => {
                    if (sms.recipientPhone) {
                        smsStatusMap[sms.recipientPhone] = this.mapSmsStatus(sms.status);
                    }
                });
                return {
                    id: fc.packId,
                    travelDate: fc.travelDate.toISOString().split('T')[0],
                    type: fc.pack.type,
                    status: fc.pack.status,
                    passengers: fc.pack.passengers.map((passenger) => ({
                        id: passenger.id,
                        firstName: passenger.firstName || '-',
                        lastName: passenger.lastName || '-',
                        nationalCode: passenger.nationalCode,
                        phone: passenger.phone,
                        travelDate: passenger.travelDate,
                        returnDate: passenger.returnDate || '-',
                        birthDate: passenger.birthDate || '-',
                        leaderName: passenger.leaderName || '-',
                        leaderPhone: passenger.leaderPhone || '-',
                        gender: passenger.gender,
                        smsStatus: smsStatusMap[passenger.phone] || 'نرفته',
                    })),
                    busAssignment: fc.busAssignment,
                };
            });
            return formattedPacks;
        }
        catch (error) {
            console.error('Error fetching SMS detailed report:', error);
            throw new Error('خطا در بارگذاری گزارشات ریز پیامک‌ها');
        }
    }
    mapSmsStatus(status) {
        switch (status.toLowerCase()) {
            case 'sent':
                return 'نرفته';
            case 'delivered':
                return 'موفق';
            case 'failed':
                return 'نرسیده';
            default:
                return 'نرفته';
        }
    }
};
exports.SmsReportService = SmsReportService;
exports.SmsReportService = SmsReportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SmsReportService);
//# sourceMappingURL=sms-report.service.js.map