import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateVehicleModelDto } from './dto/create-vehicle-model.dto.js';
import { UpdateVehicleModelDto } from './dto/update-vehicle-model.dto.js';
import { VehicleModelsService } from './vehicle-models.service.js';

@Controller('vehicle-models')
export class VehicleModelsController {
  constructor(
    private readonly vehicleModelsService: VehicleModelsService,
  ) {}

  @Get()
  findAll() {
    return this.vehicleModelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleModelsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateVehicleModelDto) {
    return this.vehicleModelsService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateVehicleModelDto,
  ) {
    return this.vehicleModelsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehicleModelsService.remove(id);
  }
}