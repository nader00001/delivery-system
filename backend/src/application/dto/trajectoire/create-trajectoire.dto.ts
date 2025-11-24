import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { Camion } from 'src/core/entities/camion.entity';
import { CatalogueCreneaux } from 'src/core/entities/catalogue_creneaux.entity';

export class CreateTrajectoireDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitudeActuelle: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitudeActuelle: number;

  @IsOptional()
  @IsString()
  observations?: string;

  @IsNotEmpty()
  @IsNumber()
  catalogueId: CatalogueCreneaux;

  @IsNotEmpty()
  @IsNumber()
  camionId: Camion;
}