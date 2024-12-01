import { Injectable, BadRequestException, NotFoundException, ForbiddenException, Res } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { Participant } from './schema/participant.schema';
import { Event } from 'src/event/schema/event.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/Update-ParticipantDto';
import jsPDF from 'jspdf';

@Injectable()
export class ParticipantsService {
  constructor(@InjectModel(Participant.name) private participantModel: Model<Participant>,
  @InjectModel(Event.name) private eventModel: Model<Event>,) {}

  async registerParticipant(createParticipantDto: CreateParticipantDto): Promise<any> {
    const { email, eventId } = createParticipantDto;
  
    const existingParticipant = await this.participantModel.findOne({ email, eventId });
    if (existingParticipant) {
      throw new BadRequestException(`Participant with email ${email} is already registered for this event.`);
    }
  
    const event = await this.eventModel.findById(eventId).exec();
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found.`);
    }

    if (event.availableSeats <= 0) {
      throw new BadRequestException('No available seats for this event.');
    }
  
  
    event.availableSeats -= 1;
    await event.save();
  
  
    try {
      const newParticipant = new this.participantModel(createParticipantDto);
      await newParticipant.save();
  
      return {
        message: 'Participant registered successfully.',
        participant: newParticipant,
      };
    } catch (error) {
      console.error('Error while registering participant:', error);
      throw new BadRequestException('An error occurred while registering the participant.');
    }
  }

  async updateParticipant(
    participantId: string, 
    updateParticipantDto: UpdateParticipantDto,
  ): Promise<any> {
    const { email, phone, eventId } = updateParticipantDto;

    const participant = await this.participantModel.findById(participantId);
    if (!participant) {
      throw new NotFoundException(`Participant with ID ${participantId} not found.`);
    }

  
    const existingParticipant = await this.participantModel.findOne({ email, eventId });
    if (existingParticipant && existingParticipant._id.toString() !== participantId) {
      throw new BadRequestException(`Participant with email ${email} is already registered for this event.`);
    }

   
    participant.name = updateParticipantDto.name || participant.name;
    participant.email = updateParticipantDto.email || participant.email;
    participant.phone = updateParticipantDto.phone || participant.phone;


    await participant.save(); 

    return {
      message: 'Participant updated successfully.',
      participant: participant,
    };
  }

  async removeParticipant(participantId: string, eventId: string): Promise<any> {
    const participant = await this.participantModel.findOneAndDelete({ _id: participantId, eventId });
    if (!participant) {
      throw new NotFoundException(`Participant not found in event with ID ${eventId}.`);
    }

   
    const updatedEvent = await this.eventModel.findByIdAndUpdate(
      eventId,
      { $inc: { availableSeats: 1 } },
      { new: true },
    );

    if (!updatedEvent) {
      throw new BadRequestException(`Failed to update event with ID ${eventId}.`);
    }

    return {
      message: 'Participant removed successfully, seat freed.',
      participant,
    };
  }


  async getParticipantsForEvent(eventId: string, userId: string): Promise<any> {
    console.log('Received User ID:', userId);  

    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
        throw new NotFoundException(`L'ID de l'événement ${eventId} est invalide.`);
      }
    
    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found.`);
    }

    if (event.organizerId.toString() !== userId) {
      throw new ForbiddenException('You are not the organizer of this event.');
    }

    const participants = await this.participantModel.find({ eventId }).populate('eventId');
    
    if (participants.length === 0) {
      return { message: 'No participants found for this event.' };
    }

    return {
      participants,
      totalParticipants: participants.length,
    };
}



async generateParticipantsPdf(eventId: string, userId: string, response: Response): Promise<void> {
    console.log('Generating PDF for event:', eventId);

    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      throw new NotFoundException(`L'ID de l'événement ${eventId} est invalide.`);
    }

    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found.`);
    }

    if (event.organizerId.toString() !== userId) {
      throw new ForbiddenException('You are not the organizer of this event.');
    }

    const participants = await this.participantModel.find({ eventId });
    if (participants.length === 0) {
      throw new NotFoundException('No participants found for this event.');
    }

    const doc = new jsPDF();

  
    const participantsPerPage = 20;
    const pageHeight = 297; 
    const marginTop = 20;
    const marginBottom = 20;
    const lineSpacing = 10;
    const maxLinesPerPage = Math.floor((pageHeight - marginTop - marginBottom) / lineSpacing);

    let currentPage = 1;
    let yPosition = marginTop;

  
    doc.setFontSize(16);
    doc.text(`Participants List for Event: ${event.title}`, 10, yPosition);
    yPosition += 10;

    participants.forEach((participant, index) => {
      if ((index % participantsPerPage === 0) && index !== 0) {
       
        doc.addPage();
        currentPage++;
        yPosition = marginTop;

       
        doc.setFontSize(12);
        doc.text(`Participants List for Event: ${event.title} (Page ${currentPage})`, 10, yPosition);
        yPosition += 10;
      }

  
      doc.setFontSize(10);
      doc.text(
        `${index + 1}. Name: ${participant.name}, Email: ${participant.email}, Phone: ${participant.phone}`,
        10,
        yPosition,
      );
      yPosition += lineSpacing;
    });

 
    const pdfBuffer = doc.output('arraybuffer');
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', `attachment; filename="participants-${eventId}.pdf"`);
    response.send(Buffer.from(pdfBuffer));

}
}
