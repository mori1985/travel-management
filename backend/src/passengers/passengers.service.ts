import { Injectable, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Passenger } from '@prisma/client';
import { CreatePassengerDto } from './dto/create-passenger.dto';

@Injectable()
export class PassengersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePassengerDto, userRole: string, userId: number): Promise<Passenger> {
    if (userRole !== 'level1' && userRole !== 'admin') {
      throw new ForbiddenException('Only level1 or admin can create passengers');
    }
    try {
      return await this.prisma.passenger.create({
        data: {
          name: data.name,
          lastname: data.lastname,
          gender: data.gender,
          phone: data.phone,
          nationalId: data.nationalId,
          travelDate: new Date(data.travelDate),
          returnDate: data.returnDate ? new Date(data.returnDate) : null,
          birthDate: new Date(data.birthDate),
          travelType: data.travelType,
          leaderName: data.leaderName,
          leaderPhone: data.leaderPhone,
          packId: data.packId,
          createdById: userId,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(`Passenger with nationalId ${data.nationalId} already exists`);
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
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
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