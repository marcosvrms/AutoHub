import { Module } from '@nestjs/common';
import { ManufacturersService } from './manufacturers.service.js';
import { ManufacturersController } from './manufacturers.controller.js';

@Module({
  providers: [ManufacturersService],
  controllers: [ManufacturersController]
})
export class ManufacturersModule {}
