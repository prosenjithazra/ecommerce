import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BannerDocument = Banner & Document;

@Schema({ timestamps: true, collection: 'banners' })
export class Banner {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ default: '' })
  badge: string;

  @Prop({ default: '' })
  headline1: string;

  @Prop({ default: '' })
  headline2: string;

  @Prop({ default: '#F9A37E' })
  headline2Color: string;

  @Prop({ default: '' })
  sub: string;

  @Prop({ default: '' })
  productImg: string;

  @Prop({ default: '' })
  bgImg: string;

  @Prop({ default: '' })
  headline1Color: string;

  @Prop({ default: '' })
  subColor: string;

  @Prop({ default: '' })
  badgeColor: string;

  @Prop({ default: '#000000' })
  overlayColor: string;

  @Prop({ default: '#E8E2D6' })
  bg: string;

  @Prop({ default: '#F9A37E' })
  accent: string;

  @Prop({ default: true })
  textDark: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Array, default: [] })
  badges: any[];

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);
