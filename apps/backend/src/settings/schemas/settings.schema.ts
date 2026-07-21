import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SettingsDocument = Settings & Document;

@Schema({ timestamps: true, collection: 'settings' })
export class Settings {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ default: 'support@kliamofashion.com' })
  email: string;

  @Prop({ default: '+1 555-0199' })
  phone: string;

  @Prop({ default: '123 Creative St, New York, NY 10001' })
  address: string;

  @Prop({ default: 'Mon - Fri, 9am - 6pm EST' })
  hours: string;

  @Prop({ default: 'https://twitter.com/kliamo' })
  twitterUrl: string;

  @Prop({ default: 'https://instagram.com/kliamo' })
  instagramUrl: string;

  @Prop({ default: 'https://facebook.com/kliamo' })
  facebookUrl: string;

  @Prop({ default: 599 })
  customTshirtPrice: number;

  @Prop({ default: 799 })
  customPoloPrice: number;

  @Prop({ default: 999 })
  customShirtPrice: number;

  @Prop()
  updatedAt?: Date;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
