import { Module } from '@nestjs/common';
import { BusAssignmentService } from './bus-assignment.service';
import { BusAssignmentController } from './bus-assignment.controller';
import { PrismaService } from '../prisma.service';
import { PacksModule } from '../packs/packs.module'; // وارد کردن PacksModule

@Module({
  controllers: [BusAssignmentController],
  providers: [BusAssignmentService, PrismaService],
  imports: [PacksModule], // اضافه کردن PacksModule به imports
})
export class BusAssignmentModule {}