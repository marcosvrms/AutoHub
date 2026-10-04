import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipeBuilder,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { ListingSearchDto } from './dto/listing-search.dto.js';
import { CreateListingDto } from './dto/create-listing.dto.js';
import { CreateListingImageDto } from './dto/create-listing-image.dto.js';
import { SetListingAttributesDto } from './dto/set-listing-attributes.dto.js';
import { UpdateListingDto } from './dto/update-listing.dto.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.js';
import { ListingsService } from './listings.service.js';
import { UserRole } from '../generated/prisma/client.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Public } from '../auth/decorators/public.decorator.js';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ListingImageStorage } from './listing-image.storage.js';

@Controller('listings')
export class ListingsController {
  constructor(
    private readonly listingsService: ListingsService,
    private readonly imageStorage: ListingImageStorage,
  ) {}

@Roles(UserRole.ADMIN)
@Get('admin/all')
findAllForAdmin() {
  return this.listingsService.findAllForAdmin();
}

@Roles(UserRole.ADMIN)
@Delete(':id')
remove(
  @Param('id') id: string,
) {
  return this.listingsService.remove(id);
}

  @Get('mine')
findMine(
  @CurrentUser()
  user: AuthenticatedUser,
) {
  return this.listingsService.findMine(
    user.sub,
  );
}

  @Public()
  @Get()
  findAll(@Query() query: ListingSearchDto) {
  return this.listingsService.findAll(query);
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
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.listingsService.updateAttributes(
      id,
      dto,
      user
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
  async addImage(
    @Param('id') id: string,
    @Body() dto: CreateListingImageDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.listingsService.addImage(
      id,
      dto,
      user
    );
  }

  @Post(':id/images/upload')
@UseInterceptors(
  FileInterceptor('file', {
    storage: memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024,
      files: 1,
    },
  }),
)
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
      displayOrder: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['file', 'displayOrder'],
  },
})
async uploadImage(
  @Param('id') id: string,
  @UploadedFile(
    new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: /^image\/(jpeg|png|webp)$/,
      })
      .addMaxSizeValidator({
        maxSize: 5 * 1024 * 1024,
      })
      .build({
        fileIsRequired: true,
      }),
  )
  file: Express.Multer.File,
  @Body() dto: CreateListingImageDto,
  @CurrentUser() user: AuthenticatedUser,
    ) {
      return this.listingsService.addUploadedImage(
        id,
        file,
        dto.displayOrder,
        user,
        
      );
    }
    

  @Delete(':listingId/images/:imageId')
  removeImage(
    @Param('listingId') listingId: string,
    @Param('imageId') imageId: string,  
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.listingsService.removeImage(
      listingId,
      imageId,
      user
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
  @CurrentUser()
  user: AuthenticatedUser,
  ) {
    return this.listingsService.create(
      user.sub,
      dto,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateListingDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.listingsService.update(
      id,
      dto,
      user
    );
  }

  @Post(':id/publish')
  publish(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.listingsService.publish(
      id,
      user
    );
  }

  @Post(':id/deactivate')
  deactivate(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.listingsService.deactivate(
      id,
      user
    );
  }

  @Post(':id/sell')
  markAsSold(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.listingsService.markAsSold(
      id,
      user
    );
  }
}