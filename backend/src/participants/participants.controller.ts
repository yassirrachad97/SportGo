import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/Update-ParticipantDto';

@Controller('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Post('register')
  async createParticipant(@Body() createParticipantdto: CreateParticipantDto) {
    return await this.participantsService.registerParticipant(createParticipantdto);
  }

  @Put(':id')
  async ModifierParticipant(
    @Param('id') participantId: string,
    @Body() updateParticipantDto: UpdateParticipantDto,
  ): Promise<any> {
    return this.participantsService.updateParticipant(participantId, updateParticipantDto);
  }
}
