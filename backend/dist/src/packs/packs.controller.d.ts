import { PacksService } from './packs.service';
import { CreatePackDto } from './dto/create-pack.dto';
import { UpdatePackDto } from './dto/update-pack.dto';
export declare class PacksController {
    private readonly packsService;
    constructor(packsService: PacksService);
    create(createPackDto: CreatePackDto, req: any): Promise<{
        id: number;
        createdAt: Date;
        travelDate: Date;
        type: string;
        repository: number;
        company: string | null;
        plate: string | null;
        driver: string | null;
        driverPhone: string | null;
    }>;
    findAll(type?: string, startDate?: string, endDate?: string): Promise<{
        id: number;
        createdAt: Date;
        travelDate: Date;
        type: string;
        repository: number;
        company: string | null;
        plate: string | null;
        driver: string | null;
        driverPhone: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: number;
        createdAt: Date;
        travelDate: Date;
        type: string;
        repository: number;
        company: string | null;
        plate: string | null;
        driver: string | null;
        driverPhone: string | null;
    } | null>;
    findPassengers(id: string): Promise<({
        pack: {
            id: number;
            createdAt: Date;
            travelDate: Date;
            type: string;
            repository: number;
            company: string | null;
            plate: string | null;
            driver: string | null;
            driverPhone: string | null;
        } | null;
        createdBy: {
            id: number;
            username: string;
            password: string;
            role: string;
            createdAt: Date;
        };
    } & {
        id: number;
        createdAt: Date;
        firstName: string | null;
        lastName: string | null;
        gender: string;
        phone: string;
        nationalCode: string | null;
        travelDate: string;
        returnDate: string | null;
        birthDate: string;
        travelType: string;
        leaderName: string | null;
        leaderPhone: string | null;
        packId: number | null;
        createdById: number;
    })[]>;
    update(id: string, updatePackDto: UpdatePackDto, req: any): Promise<{
        id: number;
        createdAt: Date;
        travelDate: Date;
        type: string;
        repository: number;
        company: string | null;
        plate: string | null;
        driver: string | null;
        driverPhone: string | null;
    }>;
    remove(id: string, req: any): Promise<{
        id: number;
        createdAt: Date;
        travelDate: Date;
        type: string;
        repository: number;
        company: string | null;
        plate: string | null;
        driver: string | null;
        driverPhone: string | null;
    }>;
}
