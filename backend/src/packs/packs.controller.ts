import { Controller, Get, Post, Body, Param, ParseIntPipe, Request, UseGuards } from '@nestjs/common';
import { PacksService } from './packs.service';
import { Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('packs')
@UseGuards(JwtAuthGuard)
export class PacksController {
  constructor(private readonly packsService: PacksService) {}

  @Get()
  async findAllWithPassengers(@Body('type') type?: 'normal' | 'vip') {
    return this.packsService.findAllWithPassengers(type);
  }

  @Post('next-stage/:id')
  async nextStage(@Param('id', ParseIntPipe) id: number, @Body('status') status: 'pending' | 'assigned' | 'confirmed') {
    return this.packsService.nextStage(+id, status);
  }

  @Post()
  async assignPassengerToPack(@Body() passengerData: any, @Request() req: ExpressRequest) {
    return this.packsService.assignPassengerToPack(passengerData, req);
  }

  @Post(':packId/passengers')
  async addPassengerToPack(
    @Param('packId', ParseIntPipe) packId: number,
    @Body() passengerData: any,
    @Request() req: ExpressRequest,
  ) {
    const userId = req.user?.['sub'] as number;
    if (!userId) {
      throw new Error('کاربر معتبر نیست');
    }
    return this.packsService.addPassengerToPack(packId, { ...passengerData, createdById: userId });
  }
}