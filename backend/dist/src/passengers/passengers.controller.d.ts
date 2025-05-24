import { PassengersService } from './passengers.service';
import { Request as ExpressRequest } from 'express';
export declare class PassengersController {
    private readonly passengersService;
    constructor(passengersService: PassengersService);
    create(data: any, req: ExpressRequest): Promise<{
        id: number;
        createdAt: Date;
        travelDate: string;
        travelType: string;
        packId: number | null;
        nationalCode: string | null;
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
    checkNationalCode(nationalCode: string): Promise<{
        exists: boolean;
    }>;
    updatePassenger(id: string, passengerData: any): Promise<{
        id: number;
        createdAt: Date;
        travelDate: string;
        travelType: string;
        packId: number | null;
        nationalCode: string | null;
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
        nationalCode: string | null;
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
