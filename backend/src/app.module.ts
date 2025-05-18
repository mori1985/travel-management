import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { PassengersModule } from './passengers/passengers.module';
import { PacksModule } from './packs/packs.module';
import { BusAssignmentModule } from './bus-assignment/bus-assignment.module'; // اضافه کردن ماژول جدید
import { FinalConfirmationModule } from './final-confirmation/final-confirmation.module';

@Module({
  imports: [
    AuthModule,
    PassengersModule,
    PacksModule,
    BusAssignmentModule,
    FinalConfirmationModule,
  ],
  providers: [AppService, PrismaService],
})
export class AppModule {}
