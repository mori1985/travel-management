import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PacksService } from '../packs/packs.service';
import { Request as ExpressRequest } from 'express';

@Injectable()
export class PassengersService {
  constructor(private prisma: PrismaService, private packsService: PacksService) {}

  async create(data: any, req: ExpressRequest) {
    return this.packsService.assignPassengerToPack(data, req);
  }

  async findOne(nationalCode: string) {
    return this.prisma.passenger.findUnique({
      where: { nationalCode },
    });
  }

  async checkNationalCode(nationalCode: string) {
    const passenger = await this.findOne(nationalCode);
    return { exists: !!passenger };
  }

  async updatePassenger(id: number, data: any) {
    const passenger = await this.prisma.passenger.findUnique({
      where: { id },
    });
    if (!passenger) {
      throw new NotFoundException(`مسافر با شناسه ${id} یافت نشد`);
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

  async delete(id: number) {
    return this.prisma.passenger.delete({
      where: { id },
    });
  }
}