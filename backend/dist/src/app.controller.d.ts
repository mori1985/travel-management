import { PrismaService } from './prisma.service';
export declare class AppController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getHello(): {
        message: string;
    };
    test(): Promise<{
        id: number;
        username: string;
        password: string;
        role: string;
        createdAt: Date;
    }[]>;
}
