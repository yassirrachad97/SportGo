import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './schema/event.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  AuthModule,
],
  controllers: [EventController],
  providers: [EventService]
})
export class EventModule {}
