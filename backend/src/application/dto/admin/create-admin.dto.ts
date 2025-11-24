import { IsEmail, IsNotEmpty, isString, IsString, MinLength } from "class-validator";

export class CreateAdminDto {
  @IsNotEmpty()
  @IsString()
  nom: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  motDePasse: string;
}