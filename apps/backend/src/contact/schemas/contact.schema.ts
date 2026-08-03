import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContactDocument = Contact & Document;

@Schema({ timestamps: true, collection: 'contacts' })
export class Contact {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ default: '' })
  subject: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: 'Pending' })
  status: string;

  @Prop()
  createdAt?: Date;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
