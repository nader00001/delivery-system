import { IsDate, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTrajectoireDto {
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitudeActuelle?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitudeActuelle?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateArrivee?: Date;

  @IsOptional()
  @IsString()
  observations?: string;
}