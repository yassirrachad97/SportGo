import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { EventService } from './event.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FileInterceptor } from '@nestjs/platform-express';



@Controller('event')
@UseGuards(AuthGuard)
export class EventController {

    constructor(private readonly eventService: EventService
    ){}


 
    @Post('/create')
    @UseInterceptors(FileInterceptor('image'))
    async createEvenement(
   
     @Body() createEventDto: CreateEventDto,
     @UploadedFile() file: Express.Multer.File,
     @Request() req) {
        const organizerId = req.user.id;
     
  
        return this.eventService.createEvent(createEventDto, organizerId, file);
    }

    @Patch(':id')

    async modifierEvent(@Param('id') eventId: string, 
    @Req() req: any, 
    @Body() updateEventDto: UpdateEventDto,
){
    const organizerId = req.user.id;
    return await this.eventService.updateEvent(eventId, organizerId, updateEventDto);
    }


    @Delete('delete/:id')
    async supprimerEvent(@Param('id') eventId: string, @Request() req) {
      const organizerId = req.user.id; 
      return this.eventService.deleteEvent(eventId, organizerId);
    }
    @Get('organizer')
    async getEventsByOrganizer(@Request() req) {
        const organizerId = req.user.id;

        
        return await this.eventService.getEventsByOrganizer(organizerId);
      }
   
}
