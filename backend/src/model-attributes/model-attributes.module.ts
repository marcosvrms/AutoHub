import { Module } from '@nestjs/common';
import { ModelAttributesService } from './model-attributes.service.js';
import { ModelAttributesController } from './model-attributes.controller.js';

@Module({
  providers: [ModelAttributesService],
  controllers: [ModelAttributesController]
})
export class ModelAttributesModule {}
