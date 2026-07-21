import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AboutDocument = About & Document;

@Schema({ timestamps: true, collection: 'about' })
export class About {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ default: 'Our Story' })
  badge: string;

  @Prop({ default: 'We empower creators to bring designs to life.' })
  title: string;

  @Prop({ default: '' })
  story1: string;

  @Prop({ default: '' })
  story2: string;

  @Prop({ default: '' })
  image: string;

  @Prop({ default: 'Our Mission' })
  missionTitle: string;

  @Prop({ default: '' })
  missionDesc: string;

  @Prop({ default: 'Our Vision' })
  visionTitle: string;

  @Prop({ default: '' })
  visionDesc: string;

  @Prop({ type: Array, default: [] })
  milestones: { year: string; title: string; desc: string }[];

  @Prop({ type: Array, default: [] })
  team: { name: string; role: string; image: string }[];

  @Prop({ default: '' })
  ctaTitle: string;

  @Prop({ default: '' })
  ctaDesc: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const AboutSchema = SchemaFactory.createForClass(About);
