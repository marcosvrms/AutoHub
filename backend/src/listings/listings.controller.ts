import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateListingDto } from './dto/create-listing.dto.js';
import { CreateListingImageDto } from './dto/create-listing-image.dto.js';
import { SetListingAttributesDto } from './dto/set-listing-attributes.dto.js';
import { UpdateListingDto } from './dto/update-listing.dto.js';

import { ListingsService } from './listings.service.js';

@Controller('listings')
export class ListingsController {
  constructor(
    private readonly listingsService: ListingsService,
  ) {}

  @Get()
  findAll() {
    return this.listingsService.findAll();
  }

  @Get(':id/attributes')
  findAttributes(
    @Param('id') id: string,
  ) {
    return this.listingsService.findAttributes(
      id,
    );
  }

  @Patch(':id/attributes')
  updateAttributes(
    @Param('id') id: string,
    @Body() dto: SetListingAttributesDto,
  ) {
    return this.listingsService.updateAttributes(
      id,
      dto,
    );
  }

  @Get(':id/images')
  findImages(
    @Param('id') id: string,
  ) {
    return this.listingsService.findImages(
      id,
    );
  }

  @Post(':id/images')
  addImage(
    @Param('id') id: string,
    @Body() dto: CreateListingImageDto,
  ) {
    return this.listingsService.addImage(
      id,
      dto,
    );
  }

  @Delete(':listingId/images/:imageId')
  removeImage(
    @Param('listingId') listingId: string,
    @Param('imageId') imageId: string,
  ) {
    return this.listingsService.removeImage(
      listingId,
      imageId,
    );
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.listingsService.findOne(
      id,
    );
  }

  @Post()
  create(
    @Body() dto: CreateListingDto,
  ) {
    return this.listingsService.create(
      dto,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateListingDto,
  ) {
    return this.listingsService.update(
      id,
      dto,
    );
  }

  @Post(':id/publish')
  publish(
    @Param('id') id: string,
  ) {
    return this.listingsService.publish(
      id,
    );
  }

  @Post(':id/deactivate')
  deactivate(
    @Param('id') id: string,
  ) {
    return this.listingsService.deactivate(
      id,
    );
  }

  @Post(':id/sell')
  markAsSold(
    @Param('id') id: string,
  ) {
    return this.listingsService.markAsSold(
      id,
    );
  }
}