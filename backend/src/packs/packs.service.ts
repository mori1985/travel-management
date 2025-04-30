import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Pack } from '@prisma/client';
import { CreatePackDto } from './dto/create-pack.dto';
import { UpdatePackDto } from './dto/update-pack.dto';

@Injectable()
export class PacksService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePackDto, userRole: string): Promise<Pack> {
    if (userRole !== 'level1' && userRole !== 'admin') {
      throw new ForbiddenException('Only level1 or admin can create packs');
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

  async findAll(filters: { type?: string; startDate?: string; endDate?: string }): Promise<Pack[]> {
    const where: Prisma.PackWhereInput = {};
    if (filters.type) {
      where.type = filters.type;
    }
    if (filters.startDate && filters.endDate) {
      where.travelDate = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      };
    }
    return this.prisma.pack.findMany({
      where,
      include: { passengers: true },
    });
  }

  async findOne(id: number): Promise<Pack | null> {
    const pack = await this.prisma.pack.findUnique({
      where: { id },
      include: { passengers: true },
    });
    if (!pack) {
      throw new NotFoundException(`Pack with ID ${id} not found`);
    }
    return pack;
  }

  async findPassengers(id: number): Promise<Prisma.PassengerGetPayload<{ include: { pack: true; createdBy: true } }>[]> {
    const pack = await this.prisma.pack.findUnique({
      where: { id },
      include: { passengers: { include: { pack: true, createdBy: true } } },
    });
    if (!pack) {
      throw new NotFoundException(`Pack with ID ${id} not found`);
    }
    return pack.passengers;
  }

  async update(id: number, data: UpdatePackDto, userRole: string): Promise<Pack> {
    if (userRole !== 'level1' && userRole !== 'admin') {
      throw new ForbiddenException('Only level1 or admin can update packs');
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

  async remove(id: number, userRole: string): Promise<Pack> {
    if (userRole !== 'admin') {
      throw new ForbiddenException('Only admin can delete packs');
    }
    return this.prisma.pack.delete({
      where: { id },
    });
  }
}