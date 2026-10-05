import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { VehicleTypesService } from './vehicle-types.service.js';
import { Public } from '../auth/decorators/public.decorator.js';

@Controller('vehicle-types')
export class VehicleTypesController {
  constructor(
    private readonly vehicleTypesService: VehicleTypesService,
  ) {}

  @Public()
  @Get()
  findAll() {
    return this.vehicleTypesService.findAll();
  }

  @Public()
  @Get('category/:categoryId')
  findByCategory(
    @Param('categoryId') categoryId: string,
  ) {
    return this.vehicleTypesService.findByCategory(
      categoryId,
    );
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleTypesService.findOne(id);
  }

  @Post()
  create(
    @Body('name') name: string,
    @Body('categoryId') categoryId: string,
  ) {
    return this.vehicleTypesService.create(
      name,
      categoryId,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('categoryId') categoryId: string,
  ) {
    return this.vehicleTypesService.update(
      id,
      name,
      categoryId,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehicleTypesService.remove(id);
  }
}