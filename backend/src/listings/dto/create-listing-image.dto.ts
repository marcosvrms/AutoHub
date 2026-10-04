import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateListingImageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  @IsUrl(
    {
      protocols: ['http', 'https'],
      require_protocol: true,
    },
    {
      message: 'A URL da imagem deve ser uma URL HTTP ou HTTPS válida.',
    },
  )
  url: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  displayOrder?: number;
}

export class UploadListingImageDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  displayOrder?: number;
}