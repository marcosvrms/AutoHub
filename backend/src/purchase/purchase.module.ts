import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service.js';
import { PurchaseController } from './purchase.controller.js';

@Module({
  providers: [PurchaseService],
  controllers: [PurchaseController]
})
export class PurchaseModule {}
