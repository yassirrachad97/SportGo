import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './schema/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AwsS3Service } from 'src/utils/aws-s3.service';



@Injectable()
export class EventService {
    constructor(@InjectModel(Event.name) private eventModel: Model<Event>,
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

    async updateEvent( eventId: string, organizerId: string, updateEventDto: UpdateEventDto): Promise<Event>{
        const event = await this.eventModel.findById(eventId);

        if(!event){
            throw new NotFoundException(`evenement avec l'ID ${eventId} introuvable `);

        }

        

        if (event.organizerId.toString() !== organizerId) {
            throw new UnauthorizedException(
                `Vous n'êtes pas autorisé à modifier cet événement.`
            );
        }

        const updateEvent = await this.eventModel.findByIdAndUpdate(
            eventId,
            updateEventDto,
            {new: true}
        );
    
        return updateEvent;
    }

    async deleteEvent(eventId: string, organizerId: string): Promise<{ message: string }> {
        const event = await this.eventModel.findById(eventId);
    
        if (!event) {
          throw new NotFoundException(`Événement avec l'ID ${eventId} introuvable.`);
        }
    
        if (event.organizerId.toString() !== organizerId) {
          throw new NotFoundException(`Vous n'avez pas l'autorisation de supprimer cet événement.`);
        }
    
        await this.eventModel.findByIdAndDelete(eventId);
    
        return { message: `L'événement avec l'ID ${eventId} a été supprimé avec succès.` };
      }

      async getEventsByOrganizer(organizerId: string): Promise<Event[]> {
        return await this.eventModel.find({ organizerId }).exec();
      }
    
}
