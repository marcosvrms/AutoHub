import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service.js';
import { ListingsController } from './listings.controller.js';

@Module({
  providers: [ListingsService],
  controllers: [ListingsController]
})
export class ListingsModule {}
