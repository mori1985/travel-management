import { Controller, Post, Param, Body, HttpCode, HttpStatus, UseGuards, Get, ParseIntPipe } from '@nestjs/common';
import { BusAssignmentService } from './bus-assignment.service';
import { CreateBusAssignmentDto } from './create-bus-assignment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PacksService } from '../packs/packs.service';

@Controller('bus-assignment')
@UseGuards(JwtAuthGuard)
export class BusAssignmentController {
  constructor(
    private readonly busAssignmentService: BusAssignmentService,
    private readonly packsService: PacksService,
  ) {}

  @Get('packs/bus-assignment')
  @HttpCode(HttpStatus.OK)
  async findAllWithPassengers() {
    console.log('Received request to fetch packs for bus assignment');
    const packs = await this.busAssignmentService.findAllWithPassengers();
    console.log('Fetched packs:', packs);
    return packs;
  }

  @Post(':packId')
  @HttpCode(HttpStatus.CREATED)
  async createBusAssignment(
    @Param('packId', ParseIntPipe) packId: number,
    @Body() busAssignmentData: CreateBusAssignmentDto,
  ) {
    console.log(`Received request to create bus assignment for pack ${packId}:`, busAssignmentData);
    const result = await this.busAssignmentService.createBusAssignment(packId, busAssignmentData);
    console.log('Bus assignment created:', result);
    return result;
  }

  @Post(':packId/move-to-next-stage')
  @HttpCode(HttpStatus.OK)
  async moveToNextStage(
    @Param('packId', ParseIntPipe) packId: number,
    @Body('status') status: 'pending' | 'assigned' | 'confirmed',
  ) {
    console.log(`Received request to move pack ${packId} to status ${status}`);
    const result = await this.packsService.moveToNextStage(packId, status);
    console.log(`Pack ${packId} moved to next stage:`, result);
    return result;
  }

  @Post(':packId/previous-stage')
  @HttpCode(HttpStatus.OK)
  async moveToPreviousStage(@Param('packId', ParseIntPipe) packId: number) {
    console.log(`Received request to move pack ${packId} to previous stage`);
    const result = await this.packsService.moveToPreviousStage(packId);
    console.log(`Pack ${packId} moved to previous stage:`, result);
    return result;
  }
}