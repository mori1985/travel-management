import { Module, Global } from '@nestjs/common';
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
import { SmsReportModule } from './sms-report/sms-report.module';

@Global()
@Module({
  imports: [
    AuthModule,
    PassengersModule,
    PacksModule,
    BusAssignmentModule,
    FinalConfirmationModule,
    PassengersSearchModule,
    ReportModule,
    ConfigModule.forRoot({ isGlobal: true }),
    SmsModule,
    SmsReportModule,
  ],
  controllers: [AppController], // فقط AppController نگه دار
  providers: [AppService, PrismaService], // فقط AppService و PrismaService نگه دار
  exports: [PrismaService],
})
export class AppModule {}