import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FinalConfirmationService {
  constructor(private prisma: PrismaService) {}

  async findAllWithPassengers() {
    return this.prisma.pack.findMany({
      where: { status: 'confirmed' },
      include: { passengers: true, busAssignment: true },
      orderBy: { travelDate: 'asc' },
    });
  }

  async revertToPreviousStage(packId: number) {
    const updatedPack = await this.prisma.pack.update({
      where: { id: packId },
      data: { status: 'assigned' },
      include: { passengers: true, busAssignment: true },
    });

    return { message: 'پک با موفقیت به مرحله قبل بازگشت', updatedPack };
  }
}