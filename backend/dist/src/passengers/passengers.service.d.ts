import { PrismaService } from '../prisma.service';
import { Prisma, Passenger } from '@prisma/client';
import { CreatePassengerDto } from './dto/create-passenger.dto';
export declare class PassengersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreatePassengerDto, userRole: string, userId: number): Promise<Passenger>;
    findAll(): Promise<Passenger[]>;
    findOne(id: number): Promise<Passenger | null>;
    update(id: number, data: Prisma.PassengerUpdateInput, userRole: string): Promise<Passenger>;
    remove(id: number, userRole: string): Promise<Passenger>;
}
