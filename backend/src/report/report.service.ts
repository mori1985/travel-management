import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  PassengersByDateDto,
  PacksByTypeDto,
  GenderDistributionDto,
  AgeRangeDto,
  CompaniesDto,
  BusesDto,
  ReportResponseDto,
} from './report.dto';

// تعریف نوع داده برای خروجی کوئری خام
interface RawAgeRange {
  age_range: string;
  count: number;
}

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async getReportData(): Promise<ReportResponseDto> {
    try {
      // 1. تعداد مسافران به‌ازای هر روز
      const passengersByDate = await this.prisma.passenger.groupBy({
        by: ['travelDate'],
        _count: { id: true },
      });
      console.log('passengersByDate:', passengersByDate);
      const passengersByDateFormatted: PassengersByDateDto[] = passengersByDate.reduce((acc, item) => {
        const dateOnly = item.travelDate.split('T')[0];
        const existing = acc.find((entry) => entry.travelDate === dateOnly);
        if (existing) {
          existing.count += item._count ? (item._count as { id: number }).id : 0;
        } else {
          acc.push({
            travelDate: dateOnly,
            count: item._count ? (item._count as { id: number }).id : 0,
          });
        }
        return acc;
      }, [] as PassengersByDateDto[]);

      // 2. تعداد پک‌ها بر اساس نوع (عادی و VIP)
      const packsByType = await this.prisma.pack.groupBy({
        by: ['type'],
        _count: { id: true },
      });
      console.log('packsByType:', packsByType);
      const packsByTypeFormatted: PacksByTypeDto[] = packsByType.map((item) => ({
        type: item.type === 'normal' ? 'عادی' : item.type === 'vip' ? 'VIP' : 'نامشخص',
        count: item._count ? (item._count as { id: number }).id : 0,
      }));

      // 3. توزیع جنسیت (درصد)
      const totalPassengers = await this.prisma.passenger.count();
      console.log('totalPassengers:', totalPassengers);
      const genderDistribution = await this.prisma.passenger.groupBy({
        by: ['gender'],
        _count: { id: true },
      });
      console.log('genderDistribution raw:', genderDistribution);
      const genderDistributionFormatted: GenderDistributionDto[] = genderDistribution.map((item) => {
        let genderLabel;
        if (item.gender === 'male' || item.gender === 'مرد') {
          genderLabel = 'مرد';
        } else if (item.gender === 'female' || item.gender === 'زن') {
          genderLabel = 'زن';
        } else {
          genderLabel = 'نامشخص';
        }
        return {
          gender: genderLabel,
          percentage: totalPassengers > 0 ? (item._count ? (item._count as { id: number }).id / totalPassengers * 100 : 0) : 0,
        };
      });

      // 4. رنج سنی مسافران (بازه‌های 5 سال)
      let ageRange: RawAgeRange[] = [];
      try {
        ageRange = await this.prisma.$queryRaw<RawAgeRange[]>`
          SELECT 
            CONCAT(
              FLOOR((1404 - CAST(SUBSTRING("birthDate" FROM 1 FOR 4) AS INTEGER)) / 5) * 5 + 1,
              '-',
              FLOOR((1404 - CAST(SUBSTRING("birthDate" FROM 1 FOR 4) AS INTEGER)) / 5) * 5 + 5
            ) AS age_range,
            COUNT(*) as count
          FROM public."Passenger"
          WHERE "birthDate" IS NOT NULL
            AND "birthDate" ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
            AND CAST(SUBSTRING("birthDate" FROM 1 FOR 4) AS INTEGER) BETWEEN 1300 AND 1404
          GROUP BY 
            FLOOR((1404 - CAST(SUBSTRING("birthDate" FROM 1 FOR 4) AS INTEGER)) / 5)
          ORDER BY 
            FLOOR((1404 - CAST(SUBSTRING("birthDate" FROM 1 FOR 4) AS INTEGER)) / 5);
        `;
      } catch (error) {
        console.error('Error in ageRange query:', error);
        ageRange = [];
      }
      console.log('ageRange:', ageRange);
      const ageRangeFormatted: AgeRangeDto[] = ageRange.map((item) => ({
        age_range: item.age_range,
        count: Number(item.count),
      }));

      // 5. توزیع شرکت‌ها
      const companies = await this.prisma.busAssignment.groupBy({
        by: ['company'],
        _count: { id: true },
      });
      console.log('companies:', companies);
      const companiesFormatted: CompaniesDto[] = companies.map((item) => ({
        company: item.company || 'نامشخص',
        count: item._count ? (item._count as { id: number }).id : 0,
      }));

      // 6. تعداد پک‌ها به‌ازای هر اتوبوس
      const buses = await this.prisma.busAssignment.groupBy({
        by: ['plate'],
        _count: { id: true },
      });
      console.log('buses:', buses);
      const busesFormatted: BusesDto[] = buses.map((item) => ({
        plate: item.plate || 'نامشخص',
        count: item._count ? (item._count as { id: number }).id : 0,
      }));

      const result: ReportResponseDto = {
        passengersByDate: passengersByDateFormatted,
        packsByType: packsByTypeFormatted,
        genderDistribution: genderDistributionFormatted,
        ageRange: ageRangeFormatted,
        companies: companiesFormatted,
        buses: busesFormatted,
      };
      console.log('Final report data:', result);
      return result;
    } catch (error) {
      console.error('Error in getReportData:', error);
      throw new Error('Failed to fetch report data');
    }
  }
}