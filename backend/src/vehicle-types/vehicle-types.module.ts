import { Module } from '@nestjs/common';
import { VehicleTypesService } from './vehicle-types.service.js';
import { VehicleTypesController } from './vehicle-types.controller.js';

@Module({
  providers: [VehicleTypesService],
  controllers: [VehicleTypesController]
})
export class VehicleTypesModule {}
