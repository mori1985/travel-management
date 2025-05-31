import { Module, Global } from '@nestjs/common'; // اضافه کردن Global
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { PassengersModule } from './passengers/passengers.module';
import { PacksModule } from './packs/packs.module';
import { BusAssignmentModule } from './bus-assignment/bus-assignment.module';
import { FinalConfirmationModule } from './final-confirmation/final-confirmation.module';
import { PassengersSearchModule } from './passengerssearch/passengerssearch.module';
import { ReportModule } from './report/report.module';
import { SmsModule } from './sms/sms.module';
import { ReportController } from './report/report.controller';
import { SmsController } from './sms/sms.controller';
import { ReportService } from './report/report.service';
import { SmsService } from './sms/sms.service';

@Global() // اضافه کردن @Global() برای دسترسی گلوبال
@Module({
  imports: [
    AuthModule,
    PassengersModule,
    PacksModule,
    BusAssignmentModule,
    FinalConfirmationModule,
    PassengersSearchModule,
    ReportModule,
    ConfigModule.forRoot({ isGlobal: true }), // تنظیم ConfigModule به‌صورت گلوبال
    SmsModule,
  ],
  controllers: [ReportController, SmsController],
  providers: [AppService, PrismaService, ReportService, SmsService],
  exports: [PrismaService], // صادر کردن PrismaService برای استفاده در ماژول‌های دیگر
})
export class AppModule {}