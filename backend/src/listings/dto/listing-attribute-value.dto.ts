import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class ListingAttributeValueDto {
  @IsUUID()
  modelAttributeId: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  textValue?: string;

  @IsOptional()
  @IsInt()
  integerValue?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 4 })
  decimalValue?: number;

  @IsOptional()
  @IsBoolean()
  booleanValue?: boolean;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  optionIds?: string[];
}