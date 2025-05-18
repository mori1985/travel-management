import { Module } from '@nestjs/common';
import { PassengersService } from './passengers.service';
import { PassengersController } from './passengers.controller';
import { PrismaService } from '../prisma.service';
import { PacksService } from '../packs/packs.service';

@Module({
  controllers: [PassengersController],
  providers: [PassengersService, PrismaService, PacksService],
})
export class PassengersModule {}