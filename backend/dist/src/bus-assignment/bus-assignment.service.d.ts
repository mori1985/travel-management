import { PrismaService } from '../prisma.service';
import { CreateBusAssignmentDto } from './create-bus-assignment.dto';
export declare class BusAssignmentService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllWithPassengers(): Promise<({
        busAssignment: {
            id: number;
            company: string;
            plate: string;
            driver: string;
            driverPhone: string;
            packId: number;
        } | null;
        passengers: {
            id: number;
            packId: number | null;
            travelDate: string;
            createdAt: Date;
            firstName: string | null;
            lastName: string | null;
            gender: string;
            phone: string;
            nationalCode: string | null;
            returnDate: string | null;
            birthDate: string;
            travelType: string;
            leaderName: string | null;
            leaderPhone: string | null;
            createdById: number;
        }[];
    } & {
        id: number;
        travelDate: Date;
        type: import(".prisma/client").$Enums.PackType;
        repository: number;
        status: import(".prisma/client").$Enums.PackStatus;
        busAssignmentId: number | null;
        createdAt: Date;
    })[]>;
    assignBus(packId: number, busAssignmentData: CreateBusAssignmentDto): Promise<{
        message: string;
        busAssignment: {
            id: number;
            company: string;
            plate: string;
            driver: string;
            driverPhone: string;
            packId: number;
        };
    }>;
}
