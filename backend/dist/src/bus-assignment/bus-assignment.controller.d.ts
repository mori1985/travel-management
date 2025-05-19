import { BusAssignmentService } from './bus-assignment.service';
import { CreateBusAssignmentDto } from './create-bus-assignment.dto';
export declare class BusAssignmentController {
    private readonly busAssignmentService;
    constructor(busAssignmentService: BusAssignmentService);
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
            packId: number;
            company: string;
            plate: string;
            driver: string;
            driverPhone: string;
        } | null;
    } & {
        id: number;
        createdAt: Date;
        travelDate: Date;
        type: import(".prisma/client").$Enums.PackType;
        repository: number;
        status: import(".prisma/client").$Enums.PackStatus;
        busAssignmentId: number | null;
    })[]>;
    assignBus(packId: string, busAssignmentData: CreateBusAssignmentDto): Promise<{
        message: string;
        busAssignment: {
            id: number;
            packId: number;
            company: string;
            plate: string;
            driver: string;
            driverPhone: string;
        };
    }>;
}
