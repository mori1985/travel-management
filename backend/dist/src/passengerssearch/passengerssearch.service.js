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
exports.PassengersSearchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let PassengersSearchService = class PassengersSearchService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async searchPassengerByNationalCode(nationalCode) {
        const passenger = await this.prisma.passenger.findUnique({
            where: { nationalCode },
            include: {
                pack: {
                    include: {
                        busAssignment: true,
                        finalConfirmation: true,
                        smsHistory: {
                            where: { recipientPhone: undefined },
                            orderBy: { createdAt: 'desc' },
                        },
                    },
                },
            },
        });
        if (!passenger) {
            throw new common_1.HttpException('مسافری با این کد ملی یافت نشد', common_1.HttpStatus.NOT_FOUND);
        }
        let stage = 'registered';
        let stageText = 'ثبت‌نام اولیه';
        let packId;
        let travelType = 'normal';
        let travelDate = '';
        let returnDate;
        let birthDate;
        let smsStatus;
        if (passenger.pack) {
            stage = 'in-pack';
            stageText = 'ثبت در پک‌های مسافرتی';
            packId = passenger.pack.id;
            travelType = passenger.pack.type;
            travelDate = passenger.travelDate || '';
            returnDate = passenger.returnDate || undefined;
            birthDate = passenger.birthDate || undefined;
            const latestSms = passenger.pack.smsHistory
                .filter(sms => sms.recipientPhone === passenger.phone)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
            smsStatus = latestSms ? this.mapSmsStatus(latestSms.status) : 'تا کنون پیامکی ارسال نشده';
            if (passenger.pack.busAssignment) {
                stage = 'bus-assigned';
                stageText = 'تخصیص اتوبوس';
            }
            if (passenger.pack.finalConfirmation) {
                stage = 'final-confirmed';
                stageText = 'ثبت نهایی';
            }
        }
        else {
            travelDate = passenger.travelDate || '';
            returnDate = passenger.returnDate || undefined;
            birthDate = passenger.birthDate || undefined;
            travelType = passenger.travelType;
            smsStatus = 'تا کنون پیامکی ارسال نشده';
        }
        return {
            id: passenger.id,
            firstName: passenger.firstName || '',
            lastName: passenger.lastName || '',
            nationalCode: passenger.nationalCode || '',
            phone: passenger.phone,
            stage,
            stageText,
            packId,
            travelType,
            travelDate,
            returnDate,
            birthDate,
            smsStatus,
        };
    }
    mapSmsStatus(status) {
        switch (status.toLowerCase()) {
            case 'sent':
                return 'ارسال شده اما هنوز نرسیده';
            case 'success':
                return 'ارسال شده و رسیده';
            case 'failed':
                return 'ارسال با خطا مواجه شده';
            default:
                return 'تا کنون پیامکی ارسال نشده';
        }
    }
};
exports.PassengersSearchService = PassengersSearchService;
exports.PassengersSearchService = PassengersSearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PassengersSearchService);
//# sourceMappingURL=passengerssearch.service.js.map