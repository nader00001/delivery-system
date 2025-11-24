import { IsOptional, IsString } from 'class-validator';

export class UpdateCamionDto {
  @IsOptional()
  @IsString()
  chauffeur?: string;

  @IsOptional()
  @IsString()
  telChauffeur?: string;

  @IsOptional()
  @IsString()
  immatriculation?: string;

  @IsOptional()
  @IsString()
  modele?: string;
}
