import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateModelAttributeDto } from './dto/create-model-attribute.dto.js';
import { UpdateModelAttributeDto } from './dto/update-model-attribute.dto.js';
import { ModelAttributesService } from './model-attributes.service.js';
import { Public } from '../auth/decorators/public.decorator.js';

@Controller()
export class ModelAttributesController {
  constructor(
    private readonly modelAttributesService: ModelAttributesService,
  ) {}

  @Public()
  @Get('vehicle-models/:vehicleModelId/attributes')
  findByVehicleModel(
    @Param('vehicleModelId') vehicleModelId: string,
  ) {
    return this.modelAttributesService.findByVehicleModel(
      vehicleModelId,
    );
  }

  @Public()
  @Get('model-attributes/:id')
  findOne(@Param('id') id: string) {
    return this.modelAttributesService.findOne(id);
  }

  @Post('vehicle-models/:vehicleModelId/attributes')
  create(
    @Param('vehicleModelId') vehicleModelId: string,
    @Body() dto: CreateModelAttributeDto,
  ) {
    return this.modelAttributesService.create(
      vehicleModelId,
      dto,
    );
  }

  @Patch('model-attributes/:id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateModelAttributeDto,
  ) {
    return this.modelAttributesService.update(id, dto);
  }

  @Delete('model-attributes/:id')
  remove(@Param('id') id: string) {
    return this.modelAttributesService.remove(id);
  }
}