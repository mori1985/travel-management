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
              smsHistory: true, // از Pack به SmsHistory می‌رسیم
            },
          },
          busAssignment: true,
        },
      });

      const formattedPacks = packs.map((fc: FinalConfirmation & { pack: Pack & { passengers: Passenger[], smsHistory: SmsHistory[] }; busAssignment: any }) => {
        const smsStatusMap: { [key: string]: string } = {};
        fc.pack.smsHistory.forEach((sms) => {
          if (sms.recipientPhone) {
            smsStatusMap[sms.recipientPhone] = this.mapSmsStatus(sms.status);
          }
        });

        return {
          id: fc.packId,
          travelDate: fc.travelDate.toISOString().split('T')[0],
          type: fc.pack.type,
          status: fc.pack.status,
          passengers: fc.pack.passengers.map((passenger: Passenger) => ({
            id: passenger.id,
            firstName: passenger.firstName || '-',
            lastName: passenger.lastName || '-',
            nationalCode: passenger.nationalCode,
            phone: passenger.phone,
            travelDate: passenger.travelDate,
            returnDate: passenger.returnDate || '-',
            birthDate: passenger.birthDate || '-',
            leaderName: passenger.leaderName || '-',
            leaderPhone: passenger.leaderPhone || '-',
            gender: passenger.gender,
            smsStatus: smsStatusMap[passenger.phone] || 'نرفته',
          })),
          busAssignment: fc.busAssignment,
        };
      });

      return formattedPacks;
    } catch (error) {
      console.error('Error fetching SMS detailed report:', error);
      throw new Error('خطا در بارگذاری گزارشات ریز پیامک‌ها');
    }
  }

  private mapSmsStatus(status: string): string {
    switch (status.toLowerCase()) {
      case 'sent':
        return 'نرفته';
      case 'delivered':
        return 'موفق';
      case 'failed':
        return 'نرسیده';
      default:
        return 'نرفته';
    }
  }
}