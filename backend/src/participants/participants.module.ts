import { Module } from '@nestjs/common';
import { ParticipantsController } from './participants.controller';
import { ParticipantsService } from './participants.service';
import { Participant, ParticipantSchema } from './schema/participant.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({

  imports: [
    MongooseModule.forFeature([{ name: Participant.name, schema: ParticipantSchema }]),
  ],
  controllers: [ParticipantsController],
  providers: [ParticipantsService]
})
export class ParticipantsModule {}
