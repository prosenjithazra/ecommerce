import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true, collection: 'categories' })
export class Category {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: 0 })
  count: number;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  image: string;

  @Prop({ default: 'Active' })
  status: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
