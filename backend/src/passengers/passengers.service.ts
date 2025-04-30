import { Injectable, ForbiddenException } from '@nestjs/common';
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
    return this.prisma.passenger.create({
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
  }

  async findAll(): Promise<Passenger[]> {
    return this.prisma.passenger.findMany({
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