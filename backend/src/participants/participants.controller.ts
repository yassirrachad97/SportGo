import { Body, Controller, Delete, Get, Param, Post, Put, Request, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/Update-ParticipantDto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('participants')
@UseGuards(AuthGuard)
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Post('register')
  async createParticipant(@Body() createParticipantdto: CreateParticipantDto) {
    return await this.participantsService.registerParticipant(createParticipantdto);
  }

  @Put('update/:id')
  async ModifierParticipant(
    @Param('id') participantId: string,
    @Body() updateParticipantDto: UpdateParticipantDto,
  ): Promise<any> {
    return this.participantsService.updateParticipant(participantId, updateParticipantDto);
  }

  @Delete(':participantId/:eventId')
  async removeParticipant(
    @Param('participantId') participantId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.participantsService.removeParticipant(participantId, eventId);
  }


  @Get('event/:eventId')
 
  async getParticipants(
    @Param('eventId') eventId: string,
    @Request() req, 
  ): Promise<any> {
   

    return this.participantsService.getParticipantsForEvent(eventId, req.user?.id);  
  }

  @Get('event/:eventId/pdf')
  async ImprimerParticipantsPdf(
    @Param('eventId') eventId: string,
    @Request() req,
    @Res() res: Response,
  ) {
    const userId = req.user.id; 
    await this.participantsService.generateParticipantsPdf(eventId, userId, res);
  }
  
}
