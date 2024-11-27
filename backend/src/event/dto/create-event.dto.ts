import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsDate, IsPositive, Min, MinDate, IsOptional, IsInt } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsDate()
  @IsNotEmpty()
  @MinDate(new Date(), { message: 'The event date must be in the future.' })
  @Type(() => Date) 
  date: Date;

  @IsInt({ message: 'La capacité doit être un entier.' })
  @IsPositive({ message: 'La capacité doit être un nombre positif.' })
  @Min(1, { message: 'The capacity must be at least 1.' })
  capacity: number;
  
  @IsString()
  @IsOptional()
  image?: string;
}
