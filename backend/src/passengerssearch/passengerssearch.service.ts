import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PassengerResponse } from '../common/types';

@Injectable()
export class PassengersSearchService {
  constructor(private prisma: PrismaService) {}

  async searchPassengerByNationalCode(nationalCode: string): Promise<PassengerResponse> {
    const passenger = await this.prisma.passenger.findUnique({
      where: { nationalCode },
      include: {
        pack: {
          include: {
            busAssignment: true,
            finalConfirmation: true,
          },
        },
      },
    });

    if (!passenger) {
      throw new HttpException('مسافری با این کد ملی یافت نشد', HttpStatus.NOT_FOUND);
    }

    let stage: 'registered' | 'in-pack' | 'bus-assigned' | 'final-confirmed' = 'registered';
    let stageText: string = 'ثبت‌نام اولیه';
    let packId: number | undefined;
    let travelType: 'normal' | 'vip' = 'normal';
    let travelDate: string = '';
    let returnDate: string | undefined;
    let birthDate: string | undefined;

    if (passenger.pack) {
      stage = 'in-pack';
      stageText = 'ثبت در پک‌های مسافرتی';
      packId = passenger.pack.id;
      travelType = passenger.pack.type;
      travelDate = passenger.travelDate || '';
      returnDate = passenger.returnDate || undefined;
      birthDate = passenger.birthDate || undefined;

      if (passenger.pack.busAssignment) {
        stage = 'bus-assigned';
        stageText = 'تخصیص اتوبوس';
      }

      if (passenger.pack.finalConfirmation) {
        stage = 'final-confirmed';
        stageText = 'ثبت نهایی';
      }
    } else {
      travelDate = passenger.travelDate || '';
      returnDate = passenger.returnDate || undefined;
      birthDate = passenger.birthDate || undefined;
      travelType = passenger.travelType as 'normal' | 'vip';
    }

    return {
      id: passenger.id,
      firstName: passenger.firstName || '',
      lastName: passenger.lastName || '',
      nationalCode: passenger.nationalCode || '',
      phone: passenger.phone,
      stage,
      stageText,
      packId,
      travelType,
      travelDate,
      returnDate,
      birthDate,
    };
  }
}