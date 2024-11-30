import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateParticipantDto {
  @IsNotEmpty()
  @IsString()
   eventId: string; 

  @IsNotEmpty()
  @IsString()
   name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string; 


  @IsNotEmpty()
  @Matches(/^[0-9]{10,15}$/, {
    message: 'Phone number must be between 10 and 15 digits.',
  })
  phone: string;

}
