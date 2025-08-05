import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FinalConfirmation, Pack, Passenger, SmsHistory } from '@prisma/client';

@Injectable()
export class SmsReportService {
  constructor(private prisma: PrismaService) {}

  async getSmsDetailedReport(): Promise<any[]> {
    try {
      const packs = await this.prisma.finalConfirmation.findMany({
        include: {
          pack: {
            include: {
              passengers: true,
              smsHistory: true,
            },
          },
          busAssignment: true,
        },
      });

      const formattedPacks = packs.map(
        (
          fc: FinalConfirmation & {
            pack: Pack & { passengers: Passenger[]; smsHistory: SmsHistory[] };
            busAssignment: any;
          },
        ) => {
          const smsStatusMap: { [key: string]: string } = {};
          fc.pack.smsHistory.forEach((sms) => {
            if (sms.recipientPhone) {
              smsStatusMap[sms.recipientPhone] = this.mapSmsStatus(sms.status);
            }
          });

          // پیدا کردن وضعیت پیامک راننده
          const driverPhone = fc.busAssignment?.driverPhone;
          const driverSmsStatus = driverPhone ? smsStatusMap[driverPhone] || 'تا کنون پیامکی ارسال نشده' : 'راننده‌ای تعیین نشده';

          // پیدا کردن وضعیت پیامک مسئولین (leader)
          const passengers = fc.pack.passengers;
          const leaderPhones = [...new Set(passengers.map(p => p.leaderPhone).filter(phone => phone !== null && phone !== undefined))] as string[];
          const leaderSmsStatus = leaderPhones.length > 0
            ? leaderPhones.map(phone => smsStatusMap[phone] || 'تا کنون پیامکی ارسال نشده').join(', ')
            : 'مسئولی تعیین نشده';

          return {
            id: fc.packId,
            travelDate: this.formatDate(fc.travelDate), // فرمت تاریخ پک
            type: fc.pack.type,
            status: fc.pack.status,
            passengers: fc.pack.passengers.map((passenger: Passenger) => ({
              id: passenger.id,
              firstName: passenger.firstName || '-',
              lastName: passenger.lastName || '-',
              nationalCode: passenger.nationalCode,
              phone: passenger.phone,
              travelDate: this.formatDate(passenger.travelDate), // فرمت تاریخ مسافر
              returnDate: passenger.returnDate ? this.formatDate(passenger.returnDate) : '-',
              birthDate: passenger.birthDate ? this.formatDate(passenger.birthDate) : '-',
              leaderName: passenger.leaderName || '-',
              leaderPhone: passenger.leaderPhone || '-',
              gender: passenger.gender,
              smsStatus: smsStatusMap[passenger.phone] || 'تا کنون پیامکی ارسال نشده',
            })),
            busAssignment: {
              company: fc.busAssignment?.company || '-',
              plate: fc.busAssignment?.plate || '-',
              driver: fc.busAssignment?.driver || '-',
              driverPhone: fc.busAssignment?.driverPhone || '-',
              driverSmsStatus,
            },
            leaderSmsStatus,
          };
        },
      );

      return formattedPacks;
    } catch (error) {
      console.error('Error fetching SMS detailed report:', error);
      throw new Error('خطا در بارگذاری گزارشات ریز پیامک‌ها');
    }
  }

  private formatDate(date: Date | string): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // فقط تاریخ بدون زمان
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