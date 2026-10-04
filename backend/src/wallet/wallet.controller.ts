import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { UserRole } from '../generated/prisma/client.js';

import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

import { DepositDto } from './dto/deposit.dto.js';
import { WalletService } from './wallet.service.js';

@Controller('wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
  ) {}

  @Get()
  async getBalance(
    @CurrentUser() user: { sub: string },
  ) {
    return this.walletService.getBalance(user.sub);
  }

  @Get('transactions')
  async getTransactions(
    @CurrentUser() user: { sub: string },
  ) {
    return this.walletService.getTransactions(user.sub);
  }

  @Roles(UserRole.ADMIN)
  @Post('admin/:userId/deposit')
  async deposit(
    @Param('userId') userId: string,
    @Body() dto: DepositDto,
  ) {
    return this.walletService.deposit(userId, dto);
  }
}