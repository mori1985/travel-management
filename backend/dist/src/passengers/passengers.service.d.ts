import { PrismaService } from '../prisma.service';
import { PacksService } from '../packs/packs.service';
import { Request as ExpressRequest } from 'express';
export declare class PassengersService {
    private prisma;
    private packsService;
    constructor(prisma: PrismaService, packsService: PacksService);
    create(data: any, req: ExpressRequest): Promise<{
        id: number;
        createdAt: Date;
        travelDate: string;
        travelType: string;
        packId: number | null;
        nationalCode: string;
        firstName: string | null;
        lastName: string | null;
        gender: string;
        phone: string;
        returnDate: string | null;
        birthDate: string;
        leaderName: string | null;
        leaderPhone: string | null;
        createdById: number;
    }>;
    findOne(nationalCode: string): Promise<{
        id: number;
        createdAt: Date;
        travelDate: string;
        travelType: string;
        packId: number | null;
        nationalCode: string;
        firstName: string | null;
        lastName: string | null;
        gender: string;
        phone: string;
        returnDate: string | null;
        birthDate: string;
        leaderName: string | null;
        leaderPhone: string | null;
        createdById: number;
    } | null>;
    checkNationalCode(nationalCode: string): Promise<{
        exists: boolean;
    }>;
    updatePassenger(id: number, data: any): Promise<{
        id: number;
        createdAt: Date;
        travelDate: string;
        travelType: string;
        packId: number | null;
        nationalCode: string;
        firstName: string | null;
        lastName: string | null;
        gender: string;
        phone: string;
        returnDate: string | null;
        birthDate: string;
        leaderName: string | null;
        leaderPhone: string | null;
        createdById: number;
    }>;
    delete(id: number): Promise<{
        id: number;
        createdAt: Date;
        travelDate: string;
        travelType: string;
        packId: number | null;
        nationalCode: string;
        firstName: string | null;
        lastName: string | null;
        gender: string;
        phone: string;
        returnDate: string | null;
        birthDate: string;
        leaderName: string | null;
        leaderPhone: string | null;
        createdById: number;
    }>;
}
