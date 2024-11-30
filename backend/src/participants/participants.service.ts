import { Injectable, BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Participant } from './schema/participant.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateParticipantDto } from './dto/create-participant.dto';

@Injectable()
export class ParticipantsService {
  constructor(@InjectModel(Participant.name) private participantModel: Model<Participant>) {}

  async registerParticipant(createParticipantdto: CreateParticipantDto): Promise<any> {
    try {
      const newParticipant = new this.participantModel({ ...createParticipantdto  });
      await newParticipant.save();

      return {
        message: 'Participant registered successfully.',
        participant: newParticipant,
      };
    } catch (error) {
     
      if (error.code === 11000) {
        throw new BadRequestException('Participant is already registered for this event.');
      }
      throw error;
    }
  }
}
