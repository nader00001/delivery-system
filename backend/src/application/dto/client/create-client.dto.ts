import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Admin } from 'src/core/entities/admin.entity';

export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  nom: string;

  @IsOptional()
  @IsString()
  entreprise?: string;

  @IsNotEmpty()
  @IsString()
  telephone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  adresse?: string;

  @IsNotEmpty()
  @IsNumber()
  adminId: Admin;
}