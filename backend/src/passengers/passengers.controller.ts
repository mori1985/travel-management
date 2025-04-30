import { Controller, Get, Post, Body, Param, Put, Delete, Request, UseGuards } from '@nestjs/common';
import { PassengersService } from './passengers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { Prisma } from '@prisma/client';

@Controller('passengers')
@UseGuards(JwtAuthGuard)
export class PassengersController {
  constructor(private readonly passengersService: PassengersService) {}

  @Post()
  create(@Body() createPassengerDto: CreatePassengerDto, @Request() req) {
    return this.passengersService.create(createPassengerDto, req.user.role, req.user.userId);
  }

  @Get()
  findAll() {
    return this.passengersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.passengersService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.PassengerUpdateInput, @Request() req) {
    return this.passengersService.update(+id, data, req.user.role);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.passengersService.remove(+id, req.user.role);
  }
}