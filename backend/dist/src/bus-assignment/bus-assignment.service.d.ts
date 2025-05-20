import { PrismaService } from '../prisma.service';
import { CreateBusAssignmentDto } from './create-bus-assignment.dto';
export declare class BusAssignmentService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllWithPassengers(): Promise<({
        passengers: {
            id: number;
            createdAt: Date;
            travelDate: string;
            travelType: string;
            packId: number | null;
            firstName: string | null;
            lastName: string | null;
            gender: string;
            phone: string;
            nationalCode: string | null;
            returnDate: string | null;
            birthDate: string;
            leaderName: string | null;
            leaderPhone: string | null;
            createdById: number;
        }[];
        busAssignment: {
            id: number;
            travelDate: Date;
            type: import(".prisma/client").$Enums.PackType;
            packId: number;
            company: string | null;
            plate: string | null;
            driver: string | null;
            driverPhone: string | null;
        } | null;
    } & {
        id: number;
        createdAt: Date;
        travelDate: Date;
        type: import(".prisma/client").$Enums.PackType;
        repository: number;
        status: import(".prisma/client").$Enums.PackStatus;
        busAssignmentId: number | null;
        finalConfirmationId: number | null;
    })[]>;
    assignBus(packId: number, busAssignmentData: CreateBusAssignmentDto): Promise<{
        message: string;
        busAssignment: {
            pack: ({
                passengers: {
                    id: number;
                    createdAt: Date;
                    travelDate: string;
                    travelType: string;
                    packId: number | null;
                    firstName: string | null;
                    lastName: string | null;
                    gender: string;
                    phone: string;
                    nationalCode: string | null;
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
            }) | null;
        } & {
            id: number;
            travelDate: Date;
            type: import(".prisma/client").$Enums.PackType;
            packId: number;
            company: string | null;
            plate: string | null;
            driver: string | null;
            driverPhone: string | null;
        };
    }>;
}
