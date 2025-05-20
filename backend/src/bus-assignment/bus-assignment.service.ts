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
      include: { busAssignment: true, passengers: true },
    });

    if (!pack) {
      throw new Error('پک یافت نشد');
    }

    if (!pack.busAssignment) {
      throw new Error('تخصیص اتوبوس برای این پک هنوز ثبت نشده است');
    }

    return this.prisma.$transaction(async (prisma) => {
      const updatedBusAssignment = await prisma.busAssignment.update({
        where: { packId: packId },
        data: {
          company: busAssignmentData.company,
          plate: busAssignmentData.plate,
          driver: busAssignmentData.driver,
          driverPhone: busAssignmentData.driverPhone,
        },
        include: { pack: { include: { passengers: true } } },
      });

      await prisma.pack.update({
        where: { id: packId },
        data: { status: 'confirmed' },
      });

      await prisma.finalConfirmation.create({
        data: {
          packId: packId,
          busAssignmentId: updatedBusAssignment.id,
          travelDate: pack.travelDate,
          type: pack.type,
          company: busAssignmentData.company,
          plate: busAssignmentData.plate,
          driver: busAssignmentData.driver,
          driverPhone: busAssignmentData.driverPhone,
          confirmationDate: new Date(),
        },
      });

      await prisma.packHistory.create({
        data: {
          packId: packId,
          status: 'confirmed',
        },
      });

      return {
        message: 'تخصیص اتوبوس با موفقیت انجام شد',
        busAssignment: updatedBusAssignment,
      };
    });
  }
}
