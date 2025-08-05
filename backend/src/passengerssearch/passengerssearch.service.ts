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
            smsHistory: {
              where: { recipientPhone: undefined }, // فقط برای اطمینان، بعداً فیلتر می‌کنیم
              orderBy: { createdAt: 'desc' }, // مرتب‌سازی بر اساس آخرین تاریخ
            },
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
    let smsStatus: string | undefined;

    if (passenger.pack) {
      stage = 'in-pack';
      stageText = 'ثبت در پک‌های مسافرتی';
      packId = passenger.pack.id;
      travelType = passenger.pack.type;
      travelDate = passenger.travelDate || '';
      returnDate = passenger.returnDate || undefined;
      birthDate = passenger.birthDate || undefined;

      // پیدا کردن آخرین وضعیت پیامک برای شماره مسافر
      const latestSms = passenger.pack.smsHistory
        .filter(sms => sms.recipientPhone === passenger.phone) // فیلتر بر اساس شماره مسافر
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]; // مرتب‌سازی بر اساس createdAt
      smsStatus = latestSms ? this.mapSmsStatus(latestSms.status) : 'تا کنون پیامکی ارسال نشده';

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
      smsStatus = 'تا کنون پیامکی ارسال نشده';
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
      smsStatus,
    };
  }

  private mapSmsStatus(status: string): string {
    switch (status.toLowerCase()) {
      case 'sent':
        return 'ارسال شده اما هنوز نرسیده';
      case 'success':
        return 'ارسال شده و رسیده';
      case 'failed':
        return 'ارسال با خطا مواجه شده';
      default:
        return 'تا کنون پیامکی ارسال نشده';
    }
  }
}