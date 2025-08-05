import { PacksService } from './packs.service';
import { Request as ExpressRequest } from 'express';
export declare class PacksController {
    private readonly packsService;
    constructor(packsService: PacksService);
    findAllWithPassengers(type?: 'normal' | 'vip'): Promise<({
        busAssignment: {
            id: number;
            travelDate: Date;
            type: import(".prisma/client").$Enums.PackType;
            packId: number;
            company: string;
            plate: string;
            driver: string;
            driverPhone: string;
        } | null;
        passengers: {
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
        }[];
    } & {
        id: number;
        createdAt: Date;
        travelDate: Date;
        type: import(".prisma/client").$Enums.PackType;
        repository: number;
        status: import(".prisma/client").$Enums.PackStatus;
        busAssignmentId: number | null;
        finalConfirmationId: number | null;
        updatedAt: Date;
    })[]>;
    findAllAssignedPacks(): Promise<({
        busAssignment: {
            id: number;
            travelDate: Date;
            type: import(".prisma/client").$Enums.PackType;
            packId: number;
            company: string;
            plate: string;
            driver: string;
            driverPhone: string;
        } | null;
        passengers: {
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
        }[];
    } & {
        id: number;
        createdAt: Date;
        travelDate: Date;
        type: import(".prisma/client").$Enums.PackType;
        repository: number;
        status: import(".prisma/client").$Enums.PackStatus;
        busAssignmentId: number | null;
        finalConfirmationId: number | null;
        updatedAt: Date;
    })[]>;
    moveToNextStage(packId: number, status: 'pending' | 'assigned' | 'confirmed'): Promise<{
        message: string;
        updatedPack: {
            busAssignment: {
                id: number;
                travelDate: Date;
                type: import(".prisma/client").$Enums.PackType;
                packId: number;
                company: string;
                plate: string;
                driver: string;
                driverPhone: string;
            } | null;
            passengers: {
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
            }[];
        } & {
            id: number;
            createdAt: Date;
            travelDate: Date;
            type: import(".prisma/client").$Enums.PackType;
            repository: number;
            status: import(".prisma/client").$Enums.PackStatus;
            busAssignmentId: number | null;
            finalConfirmationId: number | null;
            updatedAt: Date;
        };
    }>;
    moveToPreviousStage(packId: number): Promise<{
        message: string;
        updatedPack: {
            busAssignment: {
                id: number;
                travelDate: Date;
                type: import(".prisma/client").$Enums.PackType;
                packId: number;
                company: string;
                plate: string;
                driver: string;
                driverPhone: string;
            } | null;
            passengers: {
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
            }[];
        } & {
            id: number;
            createdAt: Date;
            travelDate: Date;
            type: import(".prisma/client").$Enums.PackType;
            repository: number;
            status: import(".prisma/client").$Enums.PackStatus;
            busAssignmentId: number | null;
            finalConfirmationId: number | null;
            updatedAt: Date;
        };
    }>;
    moveToAssigned(packId: number): Promise<{
        message: string;
        updatedPack: {
            busAssignment: {
                id: number;
                travelDate: Date;
                type: import(".prisma/client").$Enums.PackType;
                packId: number;
                company: string;
                plate: string;
                driver: string;
                driverPhone: string;
            } | null;
            passengers: {
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
            }[];
        } & {
            id: number;
            createdAt: Date;
            travelDate: Date;
            type: import(".prisma/client").$Enums.PackType;
            repository: number;
            status: import(".prisma/client").$Enums.PackStatus;
            busAssignmentId: number | null;
            finalConfirmationId: number | null;
            updatedAt: Date;
        };
    }>;
    assignPassengerToPack(passengerData: any, req: ExpressRequest): Promise<{
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
    addPassengerToPack(packId: number, passengerData: any, req: ExpressRequest): Promise<{
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
    archiveOldPacks(): Promise<{
        message: string;
    }>;
    saveBusAssignment(packId: number, busAssignmentData: {
        company: string;
        plate: string;
        driver: string;
        driverPhone: string;
    }, req: ExpressRequest): Promise<void>;
}
