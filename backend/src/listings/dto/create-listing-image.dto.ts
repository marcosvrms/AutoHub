import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateListingImageDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  url: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  displayOrder?: number;
}