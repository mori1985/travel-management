export class PassengersByDateDto {
  travelDate: string;
  count: number;
}

export class PacksByTypeDto {
  type: string;
  count: number;
}

export class GenderDistributionDto {
  gender: string;
  percentage: number;
}

export class AgeRangeDto {
  age_range: string;
  count: number;
}

export class CompaniesDto {
  company: string;
  count: number;
}

export class BusesDto {
  plate: string;
  count: number;
}

export class ReportResponseDto {
  passengersByDate: PassengersByDateDto[];
  packsByType: PacksByTypeDto[];
  genderDistribution: GenderDistributionDto[];
  ageRange: AgeRangeDto[];
  companies: CompaniesDto[];
  buses: BusesDto[];
}