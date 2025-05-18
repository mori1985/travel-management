import { BusAssignmentService } from './bus-assignment.service';
import { CreateBusAssignmentDto } from './create-bus-assignment.dto';
export declare class BusAssignmentController {
    private readonly busAssignmentService;
    constructor(busAssignmentService: BusAssignmentService);
    assignBus(packId: string, busAssignmentData: CreateBusAssignmentDto): Promise<{
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
