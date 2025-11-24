import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsEnum(['validation', 'refus', 'info', 'alerte'])
  type: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsNumber()
  responsableId: number;

  @IsOptional()
  @IsNumber()
  catalogueId?: number;
}
