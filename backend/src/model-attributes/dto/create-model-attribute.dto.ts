import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { AttributeType } from '../../generated/prisma/client.js';

import { CreateModelAttributeOptionDto } from './create-model-attribute-option.dto.js';

export class CreateModelAttributeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum(AttributeType)
  type: AttributeType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateModelAttributeOptionDto)
  options?: CreateModelAttributeOptionDto[];
}