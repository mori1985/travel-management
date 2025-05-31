import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // اضافه کردن ConfigModule
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';

@Module({
  imports: [ConfigModule], // وارد کردن ConfigModule
  providers: [SmsService],
  controllers: [SmsController],
})
export class SmsModule {}