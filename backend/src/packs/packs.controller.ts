import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PacksService } from './packs.service';
import { Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('packs')
@UseGuards(JwtAuthGuard)
export class PacksController {
  constructor(private readonly packsService: PacksService) {}

  @Get()
  async findAllWithPassengers(@Body('type') type?: 'normal' | 'vip') {
    console.log('Fetching packs with passengers, type:', type);
    return this.packsService.findAllWithPassengers(type);
  }

  @Get('bus-assignment')
  async findAllAssignedPacks() {
    console.log('Fetching assigned packs...');
    return this.packsService.findAllAssignedPacks();
  }

  @Post('move-to-next-stage/:packId/:status')
  async moveToNextStage(
    @Param('packId', ParseIntPipe) packId: number,
    @Param('status') status: 'pending' | 'assigned' | 'confirmed',
  ) {
    console.log(`Received request to move pack ${packId} to status ${status}`);
    return this.packsService.moveToNextStage(packId, status);
  }

  @Post('previous-stage/:packId')
  async moveToPreviousStage(@Param('packId', ParseIntPipe) packId: number) {
    console.log(`Received request to move pack ${packId} to previous stage`);
    return this.packsService.moveToPreviousStage(packId);
  }

  @Post('to-assigned/:packId')
  async moveToAssigned(@Param('packId', ParseIntPipe) packId: number) {
    console.log(`Received request to move pack ${packId} to assigned`);
    return this.packsService.moveToNextStage(packId, 'assigned');
  }

  @Post()
  async assignPassengerToPack(
    @Body() passengerData: any,
    @Request() req: ExpressRequest,
  ) {
    console.log('Received request to assign passenger to pack:', passengerData);
    return this.packsService.assignPassengerToPack(passengerData, req);
  }

  @Post(':packId/passengers')
  async addPassengerToPack(
    @Param('packId', ParseIntPipe) packId: number,
    @Body() passengerData: any,
    @Request() req: ExpressRequest,
  ) {
    console.log(
      `Received request to add passenger to pack ${packId}:`,
      passengerData,
    );
    const userId = req.user?.['sub'] as number;
    if (!userId) {
      throw new Error('کاربر معتبر نیست');
    }
    // اضافه کردن packId به passengerData
    const updatedPassengerData = { ...passengerData, packId };
    return this.packsService.assignPassengerToPack(updatedPassengerData, req);
  }

  @Post('archive-old')
  async archiveOldPacks() {
    console.log('Received request to archive old packs');
    await this.packsService.archiveOldPacks();
    return { message: 'پک‌های قدیمی با موفقیت آرشیو شدند' };
  }

  @Post('bus-assignment/:packId')
  async saveBusAssignment(
    @Param('packId', ParseIntPipe) packId: number,
    @Body()
    busAssignmentData: {
      company: string;
      plate: string;
      driver: string;
      driverPhone: string;
    },
    @Request() req: ExpressRequest,
  ) {
    console.log('Received request to saveBusAssignment for packId:', packId);
    console.log(
      'BusAssignment data received in controller:',
      busAssignmentData,
    );

    // چک کردن اینکه همه فیلدها وجود دارن
    if (
      !busAssignmentData.company ||
      !busAssignmentData.plate ||
      !busAssignmentData.driver ||
      !busAssignmentData.driverPhone
    ) {
      console.log(
        'Validation failed: Missing required fields in busAssignmentData',
      );
      throw new Error('لطفاً همه فیلدهای اطلاعات اتوبوس را پر کنید');
    }

    const userId = req.user?.['sub'] as number;
    if (!userId) {
      throw new Error('کاربر معتبر نیست');
    }

    const result = await this.packsService.saveBusAssignment(
      packId,
      busAssignmentData,
    );
    console.log('Save bus assignment result:', result);
    return result;
  }
}
