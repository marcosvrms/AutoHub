import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service.js';
import { ListingsController } from './listings.controller.js';
import { ListingImageStorage } from './listing-image.storage.js';

@Module({
  providers: [ListingsService, ListingImageStorage],
  controllers: [ListingsController]
})
export class ListingsModule {}
