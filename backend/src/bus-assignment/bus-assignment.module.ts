import { Module } from '@nestjs/common';
import { BusAssignmentService } from './bus-assignment.service';
import { BusAssignmentController } from './bus-assignment.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [BusAssignmentController],
  providers: [BusAssignmentService, PrismaService],
})
export class BusAssignmentModule {}