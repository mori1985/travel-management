import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Request as ExpressRequest } from 'express';

@Injectable()
export class PacksService {
  constructor(private prisma: PrismaService) {}

  async findAllWithPassengers(type?: 'normal' | 'vip') {
    return this.prisma.pack.findMany({
      include: { passengers: true, busAssignment: true },
      where: {
        status: 'pending',
        ...(type && { type }),
      },
      orderBy: { travelDate: 'asc' },
    });
  }

  async assignPassengerToPack(passengerData: any, req: ExpressRequest) {
    const { travelDate, travelType, packId } = passengerData;

    const userId = req.user?.['sub'] as number;
    if (!userId) {
      throw new Error('کاربر معتبر نیست');
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
    } else {
      const parsedTravelDate = new Date(travelDate).toISOString().split('T')[0];
      pack = await this.prisma.pack.findFirst({
        where: {
          travelDate: new Date(parsedTravelDate),
          type: travelType,
          status: 'pending',
        },
        include: { passengers: true },
      });

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

    const passengerCount = pack.passengers.length;
    const maxCapacity = pack.type === 'vip' ? 25 : 40;
    if (passengerCount >= maxCapacity) {
      pack = await this.prisma.pack.create({
        data: {
          travelDate: pack.travelDate,
          type: pack.type,
          repository: 1,
          status: 'pending',
          passengers: { create: [] },
        },
        include: { passengers: true },
      });
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

  async addPassengerToPack(packId: number, passengerData: any) {
    const pack = await this.prisma.pack.findUnique({
      where: { id: packId },
      include: { passengers: true },
    });

    if (!pack) {
      throw new Error('پک یافت نشد');
    }

    const passengerCount = pack.passengers.length;
    if (passengerCount >= (pack.type === 'vip' ? 25 : 40)) {
      throw new Error('ظرفیت پک پر شده است');
    }

    const parsedTravelDate = new Date(passengerData.travelDate)
      .toISOString()
      .split('T')[0];
    const passengerDataToCreate = {
      firstName: passengerData.firstName,
      lastName: passengerData.lastName,
      nationalCode: passengerData.nationalCode,
      phone: passengerData.phone,
      travelDate: parsedTravelDate,
      returnDate: passengerData.returnDate || null,
      birthDate: passengerData.birthDate || null,
      travelType: pack.type,
      leaderName: passengerData.leaderName || null,
      leaderPhone: passengerData.leaderPhone || null,
      gender: passengerData.gender || 'unknown',
      packId: pack.id,
      createdById: passengerData.createdById || 1,
    };

    const newPassenger = await this.prisma.passenger.create({
      data: passengerDataToCreate,
    });

    return newPassenger;
  }

  async nextStage(
    packId: number,
    status: 'pending' | 'assigned' | 'confirmed',
    packData?: any,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      const pack = await prisma.pack.findUnique({
        where: { id: packId },
        include: { passengers: true, busAssignment: true },
      });

      if (!pack) {
        throw new Error('پک یافت نشد');
      }

      if (status === 'pending') {
        const existingAssignment = await prisma.busAssignment.findUnique({
          where: { packId: packId },
        });
        if (existingAssignment) {
          await prisma.busAssignment.delete({
            where: { packId: packId },
          });
        }
      }

      if (status === 'assigned') {
        const existingAssignment = await prisma.busAssignment.findUnique({
          where: { packId: packId },
        });

        if (!existingAssignment) {
          await prisma.busAssignment.create({
            data: {
              company: null,
              plate: null,
              driver: null,
              driverPhone: null,
              packId: packId,
              passengers: { connect: pack.passengers.map((p) => ({ id: p.id })) },
              travelDate: pack.travelDate,
              type: pack.type,
            },
          });
        } else {
          await prisma.busAssignment.update({
            where: { packId: packId },
            data: {
              passengers: { connect: pack.passengers.map((p) => ({ id: p.id })) },
              travelDate: pack.travelDate,
              type: pack.type,
            },
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

      return { message: 'پک با موفقیت به مرحله بعدی منتقل شد', updatedPack };
    });
  }
}