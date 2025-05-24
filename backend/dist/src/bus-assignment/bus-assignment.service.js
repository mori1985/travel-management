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
exports.BusAssignmentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let BusAssignmentService = class BusAssignmentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllWithPassengers() {
        return this.prisma.pack.findMany({
            where: { status: 'assigned' },
            include: {
                passengers: true,
                busAssignment: {
                    select: {
                        company: true,
                        plate: true,
                        driver: true,
                        driverPhone: true,
                    },
                },
            },
            orderBy: { travelDate: 'asc' },
        });
    }
    async createBusAssignment(packId, busAssignmentData) {
        const pack = await this.prisma.pack.findUnique({
            where: { id: packId },
            include: { passengers: true },
        });
        if (!pack) {
            throw new Error('پک یافت نشد');
        }
        const existingAssignment = await this.prisma.busAssignment.findUnique({
            where: { packId: packId },
        });
        if (existingAssignment) {
            if (pack.busAssignmentId !== existingAssignment.id) {
                await this.prisma.pack.update({
                    where: { id: packId },
                    data: { busAssignmentId: existingAssignment.id },
                });
            }
            return {
                message: 'تخصیص اتوبوس برای این پک قبلاً ثبت شده است',
                busAssignment: {
                    company: existingAssignment.company,
                    plate: existingAssignment.plate,
                    driver: existingAssignment.driver,
                    driverPhone: existingAssignment.driverPhone,
                },
            };
        }
        return this.prisma.$transaction(async (prisma) => {
            const newBusAssignment = await prisma.busAssignment.create({
                data: {
                    packId: packId,
                    company: busAssignmentData.company,
                    plate: busAssignmentData.plate,
                    driver: busAssignmentData.driver,
                    driverPhone: busAssignmentData.driverPhone,
                },
                include: { pack: { include: { passengers: true } } },
            });
            await prisma.pack.update({
                where: { id: packId },
                data: { busAssignmentId: newBusAssignment.id },
            });
            return {
                message: 'تخصیص اتوبوس با موفقیت ثبت شد',
                busAssignment: {
                    company: newBusAssignment.company,
                    plate: newBusAssignment.plate,
                    driver: newBusAssignment.driver,
                    driverPhone: newBusAssignment.driverPhone,
                },
            };
        });
    }
};
exports.BusAssignmentService = BusAssignmentService;
exports.BusAssignmentService = BusAssignmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BusAssignmentService);
//# sourceMappingURL=bus-assignment.service.js.map