export declare class PassengersByDateDto {
    travelDate: string;
    count: number;
}
export declare class PacksByTypeDto {
    type: string;
    count: number;
}
export declare class GenderDistributionDto {
    gender: string;
    percentage: number;
}
export declare class AgeRangeDto {
    age_range: string;
    count: number;
}
export declare class CompaniesDto {
    company: string;
    count: number;
}
export declare class BusesDto {
    plate: string;
    count: number;
}
export declare class ReportResponseDto {
    passengersByDate: PassengersByDateDto[];
    packsByType: PacksByTypeDto[];
    genderDistribution: GenderDistributionDto[];
    ageRange: AgeRangeDto[];
    companies: CompaniesDto[];
    buses: BusesDto[];
}
