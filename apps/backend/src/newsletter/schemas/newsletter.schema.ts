import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NewsletterDocument = Newsletter & Document;

@Schema({ timestamps: true, collection: 'newsletter' })
export class Newsletter {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: 'Active' })
  status: string;

  @Prop({ default: Date.now })
  subscribedAt: Date;
}

export const NewsletterSchema = SchemaFactory.createForClass(Newsletter);
