import {
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { UserRole } from '../generated/prisma/client.js';

import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

import { PurchaseService } from './purchase.service.js';

@Controller('purchases')
export class PurchaseController {
  constructor(
    private readonly purchaseService: PurchaseService,
  ) {}

  @Post('listing/:listingId')
  async purchase(
    @CurrentUser() user: { sub: string },
    @Param('listingId') listingId: string,
  ) {
    return this.purchaseService.purchase(
      user.sub,
      listingId,
    );
  }

  @Get('mine')
  async findMine(
    @CurrentUser() user: { sub: string },
  ) {
    return this.purchaseService.findMine(user.sub);
  }

  @Roles(UserRole.ADMIN)
  @Get('admin/all')
  async findAllForAdmin() {
    return this.purchaseService.findAllForAdmin();
  }
}