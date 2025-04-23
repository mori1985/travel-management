import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';


@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('test')
  async test() {
    return await this.prisma.user.findMany();
  }
}


