import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateEventDto } from './dto/create-event.dto';


@Controller('event')
export class EventController {

    constructor(private readonly eventService: EventService){}


    @UseGuards(AuthGuard)
    @Post('/create')
    async createEvenement(@Body() createEventDto: CreateEventDto, @Request() req) {
        const organizerId = req.user.id;
        return this.eventService.createEvent(createEventDto, organizerId);
    }

}
