import { Body, Controller, Post } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';

@Controller('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Post('register')
  async createParticipant(@Body() createParticipantdto: CreateParticipantDto) {
    return await this.participantsService.registerParticipant(createParticipantdto);
  }
}
