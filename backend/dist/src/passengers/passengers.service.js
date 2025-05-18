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
exports.PassengersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const packs_service_1 = require("../packs/packs.service");
let PassengersService = class PassengersService {
    prisma;
    packsService;
    constructor(prisma, packsService) {
        this.prisma = prisma;
        this.packsService = packsService;
    }
    async create(data, req) {
        return this.packsService.assignPassengerToPack(data, req);
    }
    async findOne(nationalCode) {
        return this.prisma.passenger.findUnique({
            where: { nationalCode },
        });
    }
    async checkNationalCode(nationalCode) {
        const passenger = await this.findOne(nationalCode);
        return { exists: !!passenger };
    }
    async updatePassenger(id, data) {
        const passenger = await this.prisma.passenger.findUnique({
            where: { id },
        });
        if (!passenger) {
            throw new common_1.NotFoundException(`مسافر با شناسه ${id} یافت نشد`);
        }
        return this.prisma.passenger.update({
            where: { id },
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                nationalCode: data.nationalCode,
                phone: data.phone,
                travelDate: data.travelDate,
                returnDate: data.returnDate,
                birthDate: data.birthDate,
                leaderName: data.leaderName,
                leaderPhone: data.leaderPhone,
                gender: data.gender,
            },
        });
    }
    async delete(id) {
        return this.prisma.passenger.delete({
            where: { id },
        });
    }
};
exports.PassengersService = PassengersService;
exports.PassengersService = PassengersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, packs_service_1.PacksService])
], PassengersService);
//# sourceMappingURL=passengers.service.js.map