import { PartialType } from '@nestjs/mapped-types';

import { CreateModelAttributeDto } from './create-model-attribute.dto.js';

export class UpdateModelAttributeDto extends PartialType(
  CreateModelAttributeDto,
) {}