import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateVehicleModelDto {
  @IsUUID()
  vehicleTypeId: string;

  @IsUUID()
  manufacturerId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsInt()
  @Min(1800)
  @Max(2100)
  manufactureYear: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  catalogImage?: string;
}