import { Controller, Post, Param, Body, HttpCode, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { BusAssignmentService } from './bus-assignment.service';
import { CreateBusAssignmentDto } from './create-bus-assignment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bus-assignment')
@UseGuards(JwtAuthGuard)
export class BusAssignmentController {
  constructor(private readonly busAssignmentService: BusAssignmentService) {}

  @Get('/packs/bus-assignment')
  async findAllWithPassengers() {
    return this.busAssignmentService.findAllWithPassengers();
  }

  @Post(':packId')
  @HttpCode(HttpStatus.CREATED)
  async assignBus(
    @Param('packId') packId: string,
    @Body() busAssignmentData: CreateBusAssignmentDto,
  ) {
    return this.busAssignmentService.assignBus(+packId, busAssignmentData);
  }
}