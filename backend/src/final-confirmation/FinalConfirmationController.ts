import { Controller, Get, Post, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PacksService } from '../packs/packs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('final-confirmation')
@UseGuards(JwtAuthGuard)
export class FinalConfirmationController {
  constructor(private readonly packsService: PacksService) {}

  @Get()
  async findAllConfirmedPacks() {
    return this.packsService.findAllConfirmedPacks();
  }

  @Post('revert/:packId')
  async revertToAssigned(@Param('packId', ParseIntPipe) packId: number) {
    return this.packsService.moveToNextStage(packId, 'assigned');
  }

  @Post('send-sms/:packId')
  async sendSMS(@Param('packId', ParseIntPipe) packId: number) {
    // منطق ارسال پیامک رو اینجا پیاده‌سازی کن (فعلاً فقط یه پیام برگردون)
    return { message: `پیامک برای پک ${packId} ارسال شد` };
  }
}