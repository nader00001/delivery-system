import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { Client } from 'src/core/entities/client.entity';

export class CreateCatalogueDto {
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dateDebut: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dateFin: Date;

  @IsNotEmpty()
  @IsNumber()
  clientId: Client;
}