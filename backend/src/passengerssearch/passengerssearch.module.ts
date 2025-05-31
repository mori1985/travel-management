import { Module } from '@nestjs/common';
import { PassengersSearchController } from './passengerssearch.controller';
import { PassengersSearchService } from './passengerssearch.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PassengersSearchController],
  providers: [PassengersSearchService, PrismaService],
})
export class PassengersSearchModule {}