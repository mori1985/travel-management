"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportResponseDto = exports.BusesDto = exports.CompaniesDto = exports.AgeRangeDto = exports.GenderDistributionDto = exports.PacksByTypeDto = exports.PassengersByDateDto = void 0;
class PassengersByDateDto {
    travelDate;
    count;
}
exports.PassengersByDateDto = PassengersByDateDto;
class PacksByTypeDto {
    type;
    count;
}
exports.PacksByTypeDto = PacksByTypeDto;
class GenderDistributionDto {
    gender;
    percentage;
}
exports.GenderDistributionDto = GenderDistributionDto;
class AgeRangeDto {
    age_range;
    count;
}
exports.AgeRangeDto = AgeRangeDto;
class CompaniesDto {
    company;
    count;
}
exports.CompaniesDto = CompaniesDto;
class BusesDto {
    plate;
    count;
}
exports.BusesDto = BusesDto;
class ReportResponseDto {
    passengersByDate;
    packsByType;
    genderDistribution;
    ageRange;
    companies;
    buses;
}
exports.ReportResponseDto = ReportResponseDto;
//# sourceMappingURL=report.dto.js.map