import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsDate, IsPositive, Min } from 'class-validator';

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
  @Type(() => Date) 
  date: Date;

  @IsPositive()
  @Min(1)
  capacity: number; 
}
