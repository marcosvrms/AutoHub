import {
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateModelAttributeOptionDto {
  @IsNotEmpty()
  @IsString()
  value: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  displayOrder: number = 0;
}