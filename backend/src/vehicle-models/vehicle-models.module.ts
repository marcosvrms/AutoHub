import { Module } from '@nestjs/common';
import { VehicleModelsService } from './vehicle-models.service.js';
import { VehicleModelsController } from './vehicle-models.controller.js';

@Module({
  providers: [VehicleModelsService],
  controllers: [VehicleModelsController]
})
export class VehicleModelsModule {}
