import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './schema/event.schema';
import { CreateEventDto } from './dto/create-event.dto';



@Injectable()
export class EventService {
    constructor(@InjectModel(Event.name) private eventModel: Model<Event>){}

    async createEvent(createEventDto: CreateEventDto, organizerId: string): Promise<Event>{
        const newEvent = new this.eventModel({
            ...createEventDto,
            organizerId,
        });
        return await newEvent.save();

    }
}
