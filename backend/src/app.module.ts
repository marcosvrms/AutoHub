import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { VehicleTypesModule } from './vehicle-types/vehicle-types.module.js';
import { ManufacturersModule } from './manufacturers/manufacturers.module.js';
import { VehicleModelsModule } from './vehicle-models/vehicle-models.module.js';
import { ModelAttributesModule } from './model-attributes/model-attributes.module.js';
import { ListingsModule } from './listings/listings.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { WalletModule } from './wallet/wallet.module.js';
import { PurchaseModule } from './purchase/purchase.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    CategoriesModule,
    VehicleTypesModule,
    ManufacturersModule,
    VehicleModelsModule,
    ModelAttributesModule,
    ListingsModule,
    UsersModule,
    AuthModule,
    WalletModule,
    PurchaseModule,
  ],
  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}