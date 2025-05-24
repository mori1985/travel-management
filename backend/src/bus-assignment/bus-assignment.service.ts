import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBusAssignmentDto } from './create-bus-assignment.dto';

@Injectable()
export class BusAssignmentService {
  constructor(private prisma: PrismaService) {}

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

  async createBusAssignment(packId: number, busAssignmentData: CreateBusAssignmentDto) {
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
}