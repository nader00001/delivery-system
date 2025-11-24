import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCamionDto {
  @IsNotEmpty()
  @IsString()
  chauffeur: string;

  @IsNotEmpty()
  @IsString()
  telChauffeur: string;

  @IsOptional()
  @IsString()
  immatriculation?: string;

  @IsOptional()
  @IsString()
  modele?: string;
}