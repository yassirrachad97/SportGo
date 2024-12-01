import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './schema/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AwsS3Service } from 'src/utils/aws-s3.service';
import { Participant } from 'src/participants/schema/participant.schema';



@Injectable()
export class EventService {
    constructor(@InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(Participant.name) private participantModel: Model<Participant>,
    private readonly awsS3Service: AwsS3Service){}

    async createEvent(createEventDto: CreateEventDto, 
        organizerId: string,
          file?: Express.Multer.File,
         
        ): Promise<Event>{

            let imageUrl: string;

            if (file) {
                imageUrl = await this.awsS3Service.uploadImage(file);
              } else {
                imageUrl = 'https://example.com/default-event-image.jpg';
              }


        const newEvent = new this.eventModel({
            ...createEventDto,
            organizerId,
            image: imageUrl,
           
        });
        return await newEvent.save();

    }

    async updateEvent(
      eventId: string, 
      organizerId: string, 
      updateEventDto: UpdateEventDto
    ): Promise<Event> {
      const event = await this.eventModel.findById(eventId);
    
      if (!event) {
        throw new NotFoundException(`Événement avec l'ID ${eventId} introuvable`);
      }
    
      if (event.organizerId.toString() !== organizerId) {
        throw new UnauthorizedException(`Vous n'êtes pas autorisé à modifier cet événement.`);
      }
    
      const updateFields: Partial<UpdateEventDto> = {};
    
    
      console.log("Received updateEventDto:", updateEventDto);
    
      if (updateEventDto.title) {
        updateFields.title = updateEventDto.title;
      }
      if (updateEventDto.description) updateFields.description = updateEventDto.description;
      if (updateEventDto.location) updateFields.location = updateEventDto.location;
      if (updateEventDto.date) updateFields.date = updateEventDto.date;
    
      if (updateEventDto.capacity) {
        const participantsCount = await this.participantModel.countDocuments({ eventId });
        if (updateEventDto.capacity < participantsCount) {
          throw new BadRequestException(`La nouvelle capacité ne peut pas être inférieure au nombre de participants actuels (${participantsCount})`);
        }
    
        updateFields.capacity = updateEventDto.capacity;
    
        event.availableSeats = updateEventDto.capacity - participantsCount;
      }
    
      if (updateEventDto.image) {
        updateFields.image = updateEventDto.image;
      }
    
     
      console.log("Update fields to be sent to database:", updateFields);
    
     
      const updatedEvent = await this.eventModel.findByIdAndUpdate(
        eventId,
        updateFields,
        { 
          new: true,  
          runValidators: true  
        }
      );
    
    
      console.log("Updated Event:", updatedEvent);
    
      return updatedEvent;
    }
    

    async deleteEvent(eventId: string, organizerId: string): Promise<{ message: string }> {
        const event = await this.eventModel.findById(eventId);
    
        if (!event) {
          throw new NotFoundException(`Événement avec l'ID ${eventId} introuvable.`);
        }
    
        if (event.organizerId.toString() !== organizerId) {
          throw new NotFoundException(`Vous n'avez pas l'autorisation de supprimer cet événement.`);
        }

        await this.participantModel.deleteMany({ eventId });
    
        await this.eventModel.findByIdAndDelete(eventId);
    
        return { message: `L'événement avec l'ID ${eventId} a été supprimé avec succès.` };
      }

      async getEventsByOrganizer(organizerId: string): Promise<Event[]> {
        return await this.eventModel.find({ organizerId }).exec();
      }


      async showEvent(eventId: string): Promise<any> {
        const event = await this.eventModel.findById(eventId).exec();

        if (!event) {
            throw new NotFoundException(`Événement avec l'ID ${eventId} introuvable`);
        }
        const participants = await this.participantModel.find({ eventId }).exec();
        return {
            event,
            participants,
        };
    }
    
}
