import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true, collection: 'products' })
export class Product {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  originalPrice: number;

  @Prop({ default: 5.0 })
  rating: number;

  @Prop({ default: 0 })
  reviewsCount: number;

  @Prop({ required: true })
  image: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ required: true })
  category: string;

  @Prop({ default: '' })
  categoryId?: string;

  @Prop({ default: '' })
  tag: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ type: Array, default: [] })
  colors: { name: string; hex: string }[];

  @Prop({ type: [String], default: [] })
  sizes: string[];

  @Prop({ default: true })
  inStock: boolean;

  @Prop({ required: true, unique: true })
  sku: string;

  @Prop({ default: '' })
  slug: string;

  @Prop({ type: Object, default: {} })
  skuMapping?: Record<string, string>;

  @Prop({ default: true })
  isQikinkSynced?: boolean;

  @Prop({ type: [String], default: [] })
  homeSection?: string[];

  @Prop({ default: 'Both' })
  targetGender?: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1, createdAt: -1 });
ProductSchema.index({ categoryId: 1 });
ProductSchema.index({ homeSection: 1 });
ProductSchema.index({ targetGender: 1 });
ProductSchema.index({ createdAt: -1 });
