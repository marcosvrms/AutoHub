import {
  ArrayMinSize,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { ListingAttributeValueDto } from './listing-attribute-value.dto.js';

export class SetListingAttributesDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ListingAttributeValueDto)
  values: ListingAttributeValueDto[];
}