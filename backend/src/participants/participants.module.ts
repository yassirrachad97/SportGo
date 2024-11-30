import { Module } from '@nestjs/common';
import { ParticipantsController } from './participants.controller';
import { ParticipantsService } from './participants.service';
import { Participant, ParticipantSchema } from './schema/participant.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from 'src/event/schema/event.schema';

@Module({

  imports: [
    MongooseModule.forFeature([{ name: Participant.name, schema: ParticipantSchema },
      { name: Event.name, schema: EventSchema }
    ]),
  ],
  controllers: [ParticipantsController],
  providers: [ParticipantsService]
})
export class ParticipantsModule {}
