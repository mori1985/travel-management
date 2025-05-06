import { Injectable, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Passenger } from '@prisma/client';
import { CreatePassengerDto } from './dto/create-passenger.dto';

@Injectable()
export class PassengersService {
  constructor(private prisma: PrismaService) {}

  async checkNationalCode(nationalCode: string) {
    const passenger = await this.prisma.passenger.findUnique({
      where: { nationalCode },
    });
    return { exists: !!passenger };
  }

  async create(data: CreatePassengerDto, userRole: string, userId: number): Promise<Passenger> {
    if (userRole !== 'level1' && userRole !== 'admin') {
      throw new ForbiddenException('Only level1 or admin can create passengers');
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(`Passenger with nationalCode ${data.nationalCode} already exists`);
      }
      throw error;
    }
  }

  async findAll(filters: { travelType?: string; startDate?: string; endDate?: string }): Promise<Passenger[]> {
    const where: Prisma.PassengerWhereInput = {};
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

  async findOne(id: number): Promise<Passenger | null> {
    return this.prisma.passenger.findUnique({
      where: { id },
      include: { pack: true, createdBy: true },
    });
  }

  async update(id: number, data: Prisma.PassengerUpdateInput, userRole: string): Promise<Passenger> {
    if (userRole !== 'level1' && userRole !== 'admin') {
      throw new ForbiddenException('Only level1 or admin can update passengers');
    }
    return this.prisma.passenger.update({
      where: { id },
      data,
    });
  }

  async remove(id: number, userRole: string): Promise<Passenger> {
    if (userRole !== 'admin') {
      throw new ForbiddenException('Only admin can delete passengers');
    }
    return this.prisma.passenger.delete({
      where: { id },
    });
  }
}