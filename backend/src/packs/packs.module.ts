import { Module } from '@nestjs/common';
import { PacksService } from './packs.service';
import { PacksController } from './packs.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PacksController],
  providers: [PacksService, PrismaService],
})
export class PacksModule {}