import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GalleryDocument = Gallery & Document;

@Schema({ timestamps: true, collection: 'gallery' })
export class Gallery {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  mediaUrl: string;

  @Prop({ default: '' })
  link: string;

  @Prop({ default: 'image' })
  mediaType: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);
