import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './schema/event.schema';
import { AuthModule } from 'src/auth/auth.module';
import { MulterConfigService } from '../config/multer.config';
import { MulterModule } from '@nestjs/platform-express';
import { AwsS3Service } from 'src/utils/aws-s3.service';
import { Participant, ParticipantSchema } from 'src/participants/schema/participant.schema';

@Module({
  imports: [ MongooseModule.forFeature([{ name: Event.name, schema: EventSchema },
    { name: Participant.name, schema: ParticipantSchema }
  ]),
  AuthModule,
  MulterModule.registerAsync({
    useClass: MulterConfigService,
  }),
],
  controllers: [EventController],
  providers: [EventService, AwsS3Service]
})
export class EventModule {}
