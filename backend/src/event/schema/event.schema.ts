import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";


@Schema({ timestamps: true})

export class Event extends Document{
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    location: string;

    @Prop({ required: true })
  date: Date;

  @Prop({ required: true, min: 1 })
  capacity: number;


  @Prop({ default: function () { return this.capacity; } })
  availableSeats: number;


  @Prop({ type: String, required: false }) 
  image?: string; 


  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) 
  organizerId: Types.ObjectId;



}

export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.pre('save', function (next) {
  if (this.isNew && !this.availableSeats) {
    this.availableSeats = this.capacity;
  }
  next();
});