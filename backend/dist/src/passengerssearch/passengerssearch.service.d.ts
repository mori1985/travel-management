import { PrismaService } from '../prisma.service';
import { PassengerResponse } from '../common/types';
export declare class PassengersSearchService {
    private prisma;
    constructor(prisma: PrismaService);
    searchPassengerByNationalCode(nationalCode: string): Promise<PassengerResponse>;
}
