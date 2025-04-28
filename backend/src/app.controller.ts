import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  getHello(): { message: string } {
    return { message: 'Hello World!' };
  }

  @Get('test')
  async test() {
    return await this.prisma.user.findMany();
  }
}