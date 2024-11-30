import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Participant } from './schema/participant.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/Update-ParticipantDto';

@Injectable()
export class ParticipantsService {
  constructor(@InjectModel(Participant.name) private participantModel: Model<Participant>) {}

  async registerParticipant(createParticipantDto: CreateParticipantDto): Promise<any> {
    const { email, eventId } = createParticipantDto;
    const existingParticipant = await this.participantModel.findOne({ email, eventId });
    if (existingParticipant) {
      throw new BadRequestException(`Participant with email ${email} is already registered for this event.`);
    }
    try {
      const newParticipant = new this.participantModel(createParticipantDto);
      await newParticipant.save();

      return {
        message: 'Participant registered successfully.',
        participant: newParticipant,
      };
    } catch (error) {
        console.error('Error while registering participant:', error);
      throw new BadRequestException('An error occurred while registering the participant.');
    }
  }

  async updateParticipant(
    participantId: string, 
    updateParticipantDto: UpdateParticipantDto,
  ): Promise<any> {
    const { email, phone, eventId } = updateParticipantDto;

    const participant = await this.participantModel.findById(participantId);
    if (!participant) {
      throw new NotFoundException(`Participant with ID ${participantId} not found.`);
    }

  
    const existingParticipant = await this.participantModel.findOne({ email, eventId });
    if (existingParticipant && existingParticipant._id.toString() !== participantId) {
      throw new BadRequestException(`Participant with email ${email} is already registered for this event.`);
    }

   
    participant.name = updateParticipantDto.name || participant.name;
    participant.email = updateParticipantDto.email || participant.email;
    participant.phone = updateParticipantDto.phone || participant.phone;


    await participant.save(); 

    return {
      message: 'Participant updated successfully.',
      participant: participant,
    };
  }
}
