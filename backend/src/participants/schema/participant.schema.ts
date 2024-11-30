import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";


@Schema({ timestamps: true})

export class Participant extends Document{
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true, match: /^\S+@\S+\.\S+$/ })
    email: string;

    @Prop({
        required: true,
        match: /^[0-9]{10,15}$/,
        message: "Phone must be a valid number with 10 to 15 digits",
      })
      phone: string;

  


  @Prop({ type: Types.ObjectId, ref: 'Event', required: true }) 
  eventId: Types.ObjectId;



}

export const ParticipantSchema = SchemaFactory.createForClass(Participant).index(
    { eventId: 1, email: 1 },
    { unique: true },
);