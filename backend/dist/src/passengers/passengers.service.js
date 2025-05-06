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
const client_1 = require("@prisma/client");
let PassengersService = class PassengersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkNationalCode(nationalCode) {
        const passenger = await this.prisma.passenger.findUnique({
            where: { nationalCode },
        });
        return { exists: !!passenger };
    }
    async create(data, userRole, userId) {
        if (userRole !== 'level1' && userRole !== 'admin') {
            throw new common_1.ForbiddenException('Only level1 or admin can create passengers');
        }
        try {
            return await this.prisma.passenger.create({
                data: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    gender: data.gender,
                    phone: data.phone,
                    nationalCode: data.nationalCode,
                    travelDate: data.travelDate,
                    returnDate: data.returnDate || null,
                    birthDate: data.birthDate,
                    travelType: data.travelType,
                    leaderName: data.leaderName,
                    leaderPhone: data.leaderPhone,
                    packId: data.packId,
                    createdById: userId,
                },
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new common_1.ConflictException(`Passenger with nationalCode ${data.nationalCode} already exists`);
            }
            throw error;
        }
    }
    async findAll(filters) {
        const where = {};
        if (filters.travelType) {
            where.travelType = filters.travelType;
        }
        if (filters.startDate && filters.endDate) {
            where.travelDate = {
                gte: filters.startDate,
                lte: filters.endDate,
            };
        }
        return this.prisma.passenger.findMany({
            where,
            include: { pack: true, createdBy: true },
        });
    }
    async findOne(id) {
        return this.prisma.passenger.findUnique({
            where: { id },
            include: { pack: true, createdBy: true },
        });
    }
    async update(id, data, userRole) {
        if (userRole !== 'level1' && userRole !== 'admin') {
            throw new common_1.ForbiddenException('Only level1 or admin can update passengers');
        }
        return this.prisma.passenger.update({
            where: { id },
            data,
        });
    }
    async remove(id, userRole) {
        if (userRole !== 'admin') {
            throw new common_1.ForbiddenException('Only admin can delete passengers');
        }
        return this.prisma.passenger.delete({
            where: { id },
        });
    }
};
exports.PassengersService = PassengersService;
exports.PassengersService = PassengersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PassengersService);
//# sourceMappingURL=passengers.service.js.map