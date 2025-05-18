import { Controller, Get, Post, Param, ParseIntPipe } from '@nestjs/common';
import { FinalConfirmationService } from './final-confirmation.service';

@Controller('final-confirmation')
export class FinalConfirmationController {
  constructor(private readonly finalConfirmationService: FinalConfirmationService) {}

  @Get()
  async findAllWithPassengers() {
    return this.finalConfirmationService.findAllWithPassengers();
  }

  @Post('revert/:packId')
  async revertToPreviousStage(@Param('packId', ParseIntPipe) packId: number) {
    return this.finalConfirmationService.revertToPreviousStage(packId);
  }
}