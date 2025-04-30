import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtected(@Request() req): { message: string; user: any } {
    return { message: 'This is a protected route', user: req.user };
  }
}