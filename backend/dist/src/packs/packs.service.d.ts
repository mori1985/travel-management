import { PrismaService } from '../prisma.service';
import { Prisma, Pack } from '@prisma/client';
import { CreatePackDto } from './dto/create-pack.dto';
import { UpdatePackDto } from './dto/update-pack.dto';
export declare class PacksService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreatePackDto, userRole: string): Promise<Pack>;
    findAll(): Promise<Pack[]>;
    findOne(id: number): Promise<Pack | null>;
    findPassengers(id: number): Promise<Prisma.PassengerGetPayload<{
        include: {
            pack: true;
            createdBy: true;
        };
    }>[]>;
    update(id: number, data: UpdatePackDto, userRole: string): Promise<Pack>;
    remove(id: number, userRole: string): Promise<Pack>;
}
