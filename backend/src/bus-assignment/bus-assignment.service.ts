import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBusAssignmentDto } from './create-bus-assignment.dto';

@Injectable()
export class BusAssignmentService {
  constructor(private prisma: PrismaService) {}

  async findAllWithPassengers() {
    return this.prisma.pack.findMany({
      where: { status: 'assigned' },
      include: { passengers: true, busAssignment: true },
      orderBy: { travelDate: 'asc' },
    });
  }

  async assignBus(packId: number, busAssignmentData: CreateBusAssignmentDto) {
    const pack = await this.prisma.pack.findUnique({
      where: { id: packId },
      include: { busAssignment: true },
    });

    if (!pack) {
      throw new Error('پک یافت نشد');
    }

    if (pack.busAssignment) {
      throw new Error('این پک قبلاً تخصیص اتوبوس شده است');
    }

    return this.prisma.$transaction(async (prisma) => {
      const busAssignment = await prisma.busAssignment.create({
        data: {
          company: busAssignmentData.company,
          plate: busAssignmentData.plate,
          driver: busAssignmentData.driver,
          driverPhone: busAssignmentData.driverPhone,
          packId: packId,
        },
      });

      await prisma.pack.update({
        where: { id: packId },
        data: { status: 'confirmed' },
      });

      await prisma.packHistory.create({
        data: {
          packId: packId,
          status: 'confirmed',
        },
      });

      return { message: 'تخصیص اتوبوس با موفقیت انجام شد', busAssignment };
    });
  }
}