import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CatalogueCreneaux } from 'src/core/entities/catalogue_creneaux.entity';
import { ResponsableMagasin } from 'src/core/entities/responsable-magasin.entity';

export class EnvoyerNotificationDto {
  @IsNotEmpty()
  @IsNumber()
  responsableId: ResponsableMagasin;

  @IsNotEmpty()
  @IsEnum(['validation', 'refus', 'info', 'alerte'])
  type: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsNumber()
  catalogueId?: CatalogueCreneaux;
}