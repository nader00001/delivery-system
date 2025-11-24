import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginResponsableDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  motDePasse: string;
}