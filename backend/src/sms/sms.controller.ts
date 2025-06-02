import { Controller, Post, Body, Get, Param, ParseIntPipe } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SendSmsDto } from './send-sms.dto';

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('send/:packId')
  async sendSms(
    @Param('packId', ParseIntPipe) packId: number,
    @Body() sendSmsDto: SendSmsDto,
  ) {
    console.log('Received sendSms request:', { packId, sendSmsDto });
    const adminId = 1; // چون احراز هویت نداریم، یه مقدار پیش‌فرض می‌ذاریم
    return this.smsService.sendSms(packId, sendSmsDto, adminId);
  }

  @Get('report/:packId')
  async getSmsReport(@Param('packId', ParseIntPipe) packId: number) {
    return this.smsService.getSmsReport(packId);
  }

  @Get('options')
  getCompaniesAndResponsibles() {
    return this.smsService.getCompaniesAndResponsibles();
  }

  @Get('default-message/:packId')
  async getDefaultMessage(@Param('packId', ParseIntPipe) packId: number) {
    const messageText = await this.smsService.generateMessageText(packId);
    return { messageText };
  }
}