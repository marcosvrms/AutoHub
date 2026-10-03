import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { VehicleTypesModule } from './vehicle-types/vehicle-types.module.js';
import { ManufacturersModule } from './manufacturers/manufacturers.module.js';
import { VehicleModelsModule } from './vehicle-models/vehicle-models.module.js';

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
  ],
})
export class AppModule {}