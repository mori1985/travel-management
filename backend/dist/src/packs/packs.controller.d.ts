import { PacksService } from './packs.service';
import { CreatePackDto } from './dto/create-pack.dto';
import { UpdatePackDto } from './dto/update-pack.dto';
export declare class PacksController {
    private readonly packsService;
    constructor(packsService: PacksService);
    create(createPackDto: CreatePackDto, req: any): Promise<{
        id: number;
        travelDate: Date;
        type: string;
        repository: number;
        company: string | null;
        plate: string | null;
        driver: string | null;
        driverPhone: string | null;
        createdAt: Date;
    }>;
    findAll(): Promise<{
        id: number;
        travelDate: Date;
        type: string;
        repository: number;
        company: string | null;
        plate: string | null;
        driver: string | null;
        driverPhone: string | null;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: number;
        travelDate: Date;
        type: string;
        repository: number;
        company: string | null;
        plate: string | null;
        driver: string | null;
        driverPhone: string | null;
        createdAt: Date;
    } | null>;
    findPassengers(id: string): Promise<({
        pack: {
            id: number;
            travelDate: Date;
            type: string;
            repository: number;
            company: string | null;
            plate: string | null;
            driver: string | null;
            driverPhone: string | null;
            createdAt: Date;
        } | null;
        createdBy: {
            id: number;
            createdAt: Date;
            username: string;
            password: string;
            role: string;
        };
    } & {
        name: string;
        id: number;
        travelDate: Date;
        createdAt: Date;
        lastname: string;
        gender: string;
        phone: string;
        nationalId: string;
        returnDate: Date | null;
        birthDate: Date;
        travelType: string;
        leaderName: string | null;
        leaderPhone: string | null;
        createdById: number;
        packId: number | null;
    })[]>;
    update(id: string, updatePackDto: UpdatePackDto, req: any): Promise<{
        id: number;
        travelDate: Date;
        type: string;
        repository: number;
        company: string | null;
        plate: string | null;
        driver: string | null;
        driverPhone: string | null;
        createdAt: Date;
    }>;
    remove(id: string, req: any): Promise<{
        id: number;
        travelDate: Date;
        type: string;
        repository: number;
        company: string | null;
        plate: string | null;
        driver: string | null;
        driverPhone: string | null;
        createdAt: Date;
    }>;
}
