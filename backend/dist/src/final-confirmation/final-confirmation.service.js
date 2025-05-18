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
exports.FinalConfirmationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let FinalConfirmationService = class FinalConfirmationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllWithPassengers() {
        return this.prisma.pack.findMany({
            where: { status: 'confirmed' },
            include: { passengers: true, busAssignment: true },
            orderBy: { travelDate: 'asc' },
        });
    }
    async revertToPreviousStage(packId) {
        const updatedPack = await this.prisma.pack.update({
            where: { id: packId },
            data: { status: 'assigned' },
            include: { passengers: true, busAssignment: true },
        });
        return { message: 'پک با موفقیت به مرحله قبل بازگشت', updatedPack };
    }
};
exports.FinalConfirmationService = FinalConfirmationService;
exports.FinalConfirmationService = FinalConfirmationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinalConfirmationService);
//# sourceMappingURL=final-confirmation.service.js.map