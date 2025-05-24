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
    async findAllWithPassengers(type) {
        return this.prisma.pack.findMany({
            where: {
                status: 'pending',
                ...(type && { type }),
            },
            include: { passengers: true, busAssignment: true },
            orderBy: { travelDate: 'asc' },
        });
    }
    async findAllAssignedPacks() {
        return this.prisma.pack.findMany({
            where: { status: 'assigned' },
            include: { passengers: true, busAssignment: true },
            orderBy: { travelDate: 'asc' },
        });
    }
    async assignPassengerToPack(passengerData, req) {
        const { travelDate, travelType, packId, nationalCode } = passengerData;
        const userId = req.user?.['sub'];
        if (!userId) {
            throw new Error('کاربر معتبر نیست');
        }
        const existingPassenger = await this.prisma.passenger.findUnique({
            where: { nationalCode: nationalCode },
        });
        if (existingPassenger) {
            throw new Error(`کد ملی ${nationalCode} قبلاً برای مسافر دیگری ثبت شده است.`);
        }
        let pack;
        if (packId) {
            pack = await this.prisma.pack.findUnique({
                where: { id: packId },
                include: { passengers: true },
            });
            if (!pack) {
                throw new Error('پک یافت نشد');
            }
        }
        else {
            const parsedTravelDate = new Date(travelDate).toISOString().split('T')[0];
            const packs = await this.prisma.pack.findMany({
                where: {
                    travelDate: new Date(parsedTravelDate),
                    type: travelType,
                    status: 'pending',
                },
                include: { passengers: true },
                orderBy: { id: 'asc' },
            });
            pack = packs.find((p) => p.passengers.length < (travelType === 'vip' ? 25 : 40));
            if (!pack) {
                pack = await this.prisma.pack.create({
                    data: {
                        travelDate: new Date(parsedTravelDate),
                        type: travelType,
                        repository: 1,
                        status: 'pending',
                        passengers: { create: [] },
                    },
                    include: { passengers: true },
                });
            }
        }
        if (!pack) {
            throw new Error('ایجاد پک با شکست مواجه شد');
        }
        const passengerDataToCreate = {
            firstName: passengerData.firstName,
            lastName: passengerData.lastName,
            nationalCode: passengerData.nationalCode,
            phone: passengerData.phone,
            travelDate: passengerData.travelDate,
            returnDate: passengerData.returnDate,
            birthDate: passengerData.birthDate,
            leaderName: passengerData.leaderName,
            leaderPhone: passengerData.leaderPhone,
            gender: passengerData.gender,
            packId: pack.id,
            createdById: userId,
            travelType: passengerData.travelType || pack.type,
        };
        return this.prisma.passenger.create({
            data: passengerDataToCreate,
        });
    }
    async moveToNextStage(packId, status) {
        return this.prisma.$transaction(async (prisma) => {
            console.log(`Moving pack ${packId} to status: ${status}`);
            const pack = await prisma.pack.findUnique({
                where: { id: packId },
                include: { passengers: true, busAssignment: true },
            });
            if (!pack) {
                throw new Error(`پک با شناسه ${packId} یافت نشد`);
            }
            if (status === 'pending') {
                const existingAssignment = await prisma.busAssignment.findUnique({
                    where: { packId: packId },
                });
                if (existingAssignment) {
                    await prisma.pack.update({
                        where: { id: packId },
                        data: { busAssignmentId: null },
                    });
                    await prisma.busAssignment.delete({
                        where: { packId: packId },
                    });
                }
            }
            if (status === 'assigned' && !pack.busAssignment) {
                const newAssignment = await prisma.busAssignment.create({
                    data: {
                        company: '',
                        plate: '',
                        driver: '',
                        driverPhone: '',
                        packId: packId,
                        passengers: { connect: pack.passengers.map((p) => ({ id: p.id })) },
                        travelDate: pack.travelDate,
                        type: pack.type,
                    },
                });
                await prisma.pack.update({
                    where: { id: packId },
                    data: { busAssignmentId: newAssignment.id },
                });
            }
            if (status === 'confirmed') {
                const busAssignment = await prisma.busAssignment.findUnique({
                    where: { packId: packId },
                });
                if (!busAssignment) {
                    throw new Error('تخصیص اتوبوس برای این پک یافت نشد');
                }
                const existingFinalConfirmation = await prisma.finalConfirmation.findUnique({
                    where: { packId: packId },
                });
                if (!existingFinalConfirmation) {
                    const newFinalConfirmation = await prisma.finalConfirmation.create({
                        data: {
                            packId: packId,
                            busAssignmentId: busAssignment.id,
                            travelDate: pack.travelDate,
                            type: pack.type,
                            company: busAssignment.company ?? '',
                            plate: busAssignment.plate ?? '',
                            driver: busAssignment.driver ?? '',
                            driverPhone: busAssignment.driverPhone ?? '',
                        },
                    });
                    await prisma.pack.update({
                        where: { id: packId },
                        data: { finalConfirmationId: newFinalConfirmation.id },
                    });
                }
            }
            const updatedPack = await prisma.pack.update({
                where: { id: packId },
                data: { status },
                include: { passengers: true, busAssignment: true },
            });
            await prisma.packHistory.create({
                data: {
                    packId: packId,
                    status: status,
                },
            });
            return { message: 'پک با موفقیت به مرحله جدید منتقل شد', updatedPack };
        });
    }
    async moveToPreviousStage(packId) {
        return this.prisma.$transaction(async (prisma) => {
            console.log('Received packId in moveToPreviousStage:', packId);
            const pack = await prisma.pack.findUniqueOrThrow({
                where: { id: packId },
                include: {
                    passengers: true,
                    busAssignment: true,
                    finalConfirmation: true,
                },
            });
            console.log('Pack found in transaction:', pack);
            if (pack.status === 'confirmed') {
                const finalConfirmation = await prisma.finalConfirmation.findUnique({
                    where: { packId: packId },
                });
                if (finalConfirmation) {
                    await prisma.pack.update({
                        where: { id: packId },
                        data: { finalConfirmationId: null },
                    });
                    await prisma.finalConfirmation.delete({
                        where: { packId: packId },
                    });
                }
                const updatedPack = await prisma.pack.update({
                    where: { id: packId },
                    data: { status: 'assigned' },
                    include: { passengers: true, busAssignment: true },
                });
                await prisma.packHistory.create({
                    data: {
                        packId: packId,
                        status: 'assigned',
                    },
                });
                return {
                    message: 'پک با موفقیت به مرحله تخصیص منتقل شد',
                    updatedPack,
                };
            }
            const existingAssignment = await prisma.busAssignment.findUnique({
                where: { packId: packId },
            });
            if (existingAssignment) {
                await prisma.pack.update({
                    where: { id: packId },
                    data: { busAssignmentId: null },
                });
                await prisma.busAssignment.delete({
                    where: { packId: packId },
                });
                console.log('BusAssignment deleted for packId:', packId);
            }
            else {
                console.log('No BusAssignment found for packId:', packId);
            }
            const updatedPack = await prisma.pack.update({
                where: { id: packId },
                data: { status: 'pending' },
                include: { passengers: true, busAssignment: true },
            });
            await prisma.packHistory.create({
                data: {
                    packId: packId,
                    status: 'pending',
                },
            });
            return { message: 'پک با موفقیت به مرحله قبل منتقل شد', updatedPack };
        }, { isolationLevel: 'Serializable' });
    }
    async findAllConfirmedPacks() {
        return this.prisma.pack.findMany({
            where: { status: 'confirmed' },
            include: { passengers: true, busAssignment: true },
            orderBy: { travelDate: 'asc' },
        });
    }
    async archiveOldPacks() {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const oldPacks = await this.prisma.pack.findMany({
            where: { status: 'confirmed', updatedAt: { lt: thirtyDaysAgo } },
            include: { passengers: true, busAssignment: true },
        });
        for (const pack of oldPacks) {
            await this.prisma.$transaction(async (prisma) => {
                await prisma.archivedPack.create({
                    data: {
                        packId: pack.id,
                        travelDate: pack.travelDate,
                        type: pack.type,
                        repository: pack.repository,
                        status: pack.status,
                        passengers: pack.passengers
                            ? JSON.parse(JSON.stringify(pack.passengers))
                            : [],
                        busAssignment: pack.busAssignment
                            ? JSON.parse(JSON.stringify(pack.busAssignment))
                            : null,
                        createdAt: pack.createdAt,
                        updatedAt: pack.updatedAt,
                    },
                });
                await prisma.pack.delete({ where: { id: pack.id } });
            });
        }
    }
    async saveBusAssignment(packId, busAssignmentData) {
        console.log('Received packId in saveBusAssignment:', packId);
        console.log('Received busAssignmentData:', busAssignmentData);
        const existingAssignment = await this.prisma.busAssignment.findUnique({
            where: { packId: packId },
        });
        if (existingAssignment) {
            console.log('Updating existing BusAssignment with data:', busAssignmentData);
            const updatedAssignment = await this.prisma.busAssignment.update({
                where: { packId: packId },
                data: {
                    company: busAssignmentData.company,
                    plate: busAssignmentData.plate,
                    driver: busAssignmentData.driver,
                    driverPhone: busAssignmentData.driverPhone,
                },
            });
            console.log('Updated BusAssignment:', updatedAssignment);
        }
        else {
            console.log('Creating new BusAssignment with data:', busAssignmentData);
            const pack = await this.prisma.pack.findUnique({
                where: { id: packId },
            });
            if (!pack) {
                throw new Error('پک یافت نشد');
            }
            const newAssignment = await this.prisma.busAssignment.create({
                data: {
                    company: busAssignmentData.company,
                    plate: busAssignmentData.plate,
                    driver: busAssignmentData.driver,
                    driverPhone: busAssignmentData.driverPhone,
                    packId: packId,
                    travelDate: pack.travelDate,
                    type: pack.type,
                },
            });
            console.log('Created new BusAssignment:', newAssignment);
            await this.prisma.pack.update({
                where: { id: packId },
                data: { busAssignmentId: newAssignment.id },
            });
        }
        return { message: 'اطلاعات اتوبوس با موفقیت ثبت شد' };
    }
};
exports.PacksService = PacksService;
exports.PacksService = PacksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PacksService);
//# sourceMappingURL=packs.service.js.map