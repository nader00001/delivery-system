import { IsDate, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCatalogueDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateDebut?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateFin?: Date;

  @IsOptional()
  @IsEnum(['disponible', 'reserve', 'valide', 'refuse'])
  statut?: string;
}