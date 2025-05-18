import { Controller, Post, Body, Get, Param, Delete, Put, UseGuards, Request } from '@nestjs/common';
import { PassengersService } from './passengers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';

@Controller('passengers')
@UseGuards(JwtAuthGuard)
export class PassengersController {
  constructor(private readonly passengersService: PassengersService) {}

  @Post()
  async create(@Body() data: any, @Request() req: ExpressRequest) {
    return this.passengersService.create(data, req);
  }

  @Get('check-national-code/:nationalCode')
  async checkNationalCode(@Param('nationalCode') nationalCode: string) {
    return this.passengersService.checkNationalCode(nationalCode);
  }

  @Put(':id')
  async updatePassenger(@Param('id') id: string, @Body() passengerData: any) {
    return this.passengersService.updatePassenger(parseInt(id), passengerData);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.passengersService.delete(+id);
  }
}