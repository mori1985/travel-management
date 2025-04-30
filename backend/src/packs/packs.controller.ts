import { Controller, Get, Post, Body, Param, Put, Delete, Request, UseGuards } from '@nestjs/common';
import { PacksService } from './packs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePackDto } from './dto/create-pack.dto';
import { UpdatePackDto } from './dto/update-pack.dto';

@Controller('packs')
@UseGuards(JwtAuthGuard)
export class PacksController {
  constructor(private readonly packsService: PacksService) {}

  @Post()
  create(@Body() createPackDto: CreatePackDto, @Request() req) {
    return this.packsService.create(createPackDto, req.user.role);
  }

  @Get()
  findAll() {
    return this.packsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.packsService.findOne(+id);
  }

  @Get(':id/passengers')
  findPassengers(@Param('id') id: string) {
    return this.packsService.findPassengers(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePackDto: UpdatePackDto, @Request() req) {
    return this.packsService.update(+id, updatePackDto, req.user.role);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.packsService.remove(+id, req.user.role);
  }
}