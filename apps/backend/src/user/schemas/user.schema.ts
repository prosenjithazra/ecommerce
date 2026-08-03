import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: '' })
  avatar: string;

  @Prop({ default: '' })
  phone: string;

  @Prop({ type: Array, default: [] })
  addresses: any[];

  @Prop({ type: Object, default: {} })
  preferences: any;

  @Prop({ default: 'user' })
  role: string;

  @Prop({ default: 'Active' })
  status: string;

  @Prop()
  otpCode?: string;

  @Prop()
  otpExpiry?: Date;

  @Prop({ default: 0 })
  otpAttempts?: number;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
