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
exports.PacksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let PacksService = class PacksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data, userRole) {
        if (userRole !== 'level1' && userRole !== 'admin') {
            throw new common_1.ForbiddenException('Only level1 or admin can create packs');
        }
        return this.prisma.pack.create({
            data: {
                travelDate: new Date(data.travelDate),
                type: data.type,
                repository: data.repository,
                company: data.company,
                plate: data.plate,
                driver: data.driver,
                driverPhone: data.driverPhone,
            },
        });
    }
    async findAll() {
        return this.prisma.pack.findMany({
            include: { passengers: true },
        });
    }
    async findOne(id) {
        const pack = await this.prisma.pack.findUnique({
            where: { id },
            include: { passengers: true },
        });
        if (!pack) {
            throw new common_1.NotFoundException(`Pack with ID ${id} not found`);
        }
        return pack;
    }
    async findPassengers(id) {
        const pack = await this.prisma.pack.findUnique({
            where: { id },
            include: { passengers: { include: { pack: true, createdBy: true } } },
        });
        if (!pack) {
            throw new common_1.NotFoundException(`Pack with ID ${id} not found`);
        }
        return pack.passengers;
    }
    async update(id, data, userRole) {
        if (userRole !== 'level1' && userRole !== 'admin') {
            throw new common_1.ForbiddenException('Only level1 or admin can update packs');
        }
        return this.prisma.pack.update({
            where: { id },
            data: {
                travelDate: data.travelDate ? new Date(data.travelDate) : undefined,
                type: data.type,
                repository: data.repository,
                company: data.company,
                plate: data.plate,
                driver: data.driver,
                driverPhone: data.driverPhone,
            },
        });
    }
    async remove(id, userRole) {
        if (userRole !== 'admin') {
            throw new common_1.ForbiddenException('Only admin can delete packs');
        }
        return this.prisma.pack.delete({
            where: { id },
        });
    }
};
exports.PacksService = PacksService;
exports.PacksService = PacksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PacksService);
//# sourceMappingURL=packs.service.js.map