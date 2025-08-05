import { PrismaService } from '../prisma.service';
import { CreateBusAssignmentDto } from './create-bus-assignment.dto';
export declare class BusAssignmentService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllWithPassengers(): Promise<({
        busAssignment: {
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
    createBusAssignment(packId: number, busAssignmentData: CreateBusAssignmentDto): Promise<{
        message: string;
        busAssignment: {
            company: string;
            plate: string;
            driver: string;
            driverPhone: string;
        };
    }>;
}
