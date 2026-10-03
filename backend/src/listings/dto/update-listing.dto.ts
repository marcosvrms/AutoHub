import { PartialType } from '@nestjs/mapped-types';
import { CreateListingDto } from './create-listing.dto.js';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateListingDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsBoolean()
  acceptsProposals?: boolean;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  state?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  city?: string;
}