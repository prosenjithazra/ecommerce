import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TestimonialDocument = Testimonial & Document;

@Schema({ timestamps: true, collection: 'testimonials' })
export class Testimonial {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  avatar: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  comment: string;

  @Prop({ default: '' })
  productName: string;

  /** Auto-populated from orders count — not editable by admin */
  @Prop({ default: 0 })
  userCount: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);
