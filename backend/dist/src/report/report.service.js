"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ReportService = class ReportService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getReportData() {
        try {
            const passengersByDate = await this.prisma.passenger.groupBy({
                by: ['travelDate'],
                _count: { id: true },
            });
            console.log('passengersByDate:', passengersByDate);
            const passengersByDateFormatted = passengersByDate.reduce((acc, item) => {
                const dateOnly = item.travelDate.split('T')[0];
                const existing = acc.find((entry) => entry.travelDate === dateOnly);
                if (existing) {
                    existing.count += item._count ? item._count.id : 0;
                }
                else {
                    acc.push({
                        travelDate: dateOnly,
                        count: item._count ? item._count.id : 0,
                    });
                }
                return acc;
            }, []);
            const packsByType = await this.prisma.pack.groupBy({
                by: ['type'],
                _count: { id: true },
            });
            console.log('packsByType:', packsByType);
            const packsByTypeFormatted = packsByType.map((item) => ({
                type: item.type === 'normal' ? 'عادی' : item.type === 'vip' ? 'VIP' : 'نامشخص',
                count: item._count ? item._count.id : 0,
            }));
            const totalPassengers = await this.prisma.passenger.count();
            console.log('totalPassengers:', totalPassengers);
            const genderDistribution = await this.prisma.passenger.groupBy({
                by: ['gender'],
                _count: { id: true },
            });
            console.log('genderDistribution raw:', genderDistribution);
            const genderDistributionFormatted = genderDistribution.map((item) => {
                let genderLabel;
                if (item.gender === 'male' || item.gender === 'مرد') {
                    genderLabel = 'مرد';
                }
                else if (item.gender === 'female' || item.gender === 'زن') {
                    genderLabel = 'زن';
                }
                else {
                    genderLabel = 'نامشخص';
                }
                return {
                    gender: genderLabel,
                    percentage: totalPassengers > 0 ? (item._count ? item._count.id / totalPassengers * 100 : 0) : 0,
                };
            });
            let ageRange = [];
            try {
                ageRange = await this.prisma.$queryRaw `
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
            }
            catch (error) {
                console.error('Error in ageRange query:', error);
                ageRange = [];
            }
            console.log('ageRange:', ageRange);
            const ageRangeFormatted = ageRange.map((item) => ({
                age_range: item.age_range,
                count: Number(item.count),
            }));
            const companies = await this.prisma.busAssignment.groupBy({
                by: ['company'],
                _count: { id: true },
            });
            console.log('companies:', companies);
            const companiesFormatted = companies.map((item) => ({
                company: item.company || 'نامشخص',
                count: item._count ? item._count.id : 0,
            }));
            const buses = await this.prisma.busAssignment.groupBy({
                by: ['plate'],
                _count: { id: true },
            });
            console.log('buses:', buses);
            const busesFormatted = buses.map((item) => ({
                plate: item.plate || 'نامشخص',
                count: item._count ? item._count.id : 0,
            }));
            const result = {
                passengersByDate: passengersByDateFormatted,
                packsByType: packsByTypeFormatted,
                genderDistribution: genderDistributionFormatted,
                ageRange: ageRangeFormatted,
                companies: companiesFormatted,
                buses: busesFormatted,
            };
            console.log('Final report data:', result);
            return result;
        }
        catch (error) {
            console.error('Error in getReportData:', error);
            throw new Error('Failed to fetch report data');
        }
    }
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportService);
//# sourceMappingURL=report.service.js.map