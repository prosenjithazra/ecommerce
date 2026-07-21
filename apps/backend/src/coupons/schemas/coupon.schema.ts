import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CouponDocument = Coupon & Document;

@Schema({ timestamps: true })
export class Coupon {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  code: string;

  @Prop({ required: true, enum: ['percentage', 'fixed'], default: 'percentage' })
  discountType: 'percentage' | 'fixed';

  @Prop({ required: true, min: 0 })
  discountValue: number;

  @Prop({ default: 0 })
  minOrderAmount: number;

  @Prop({ default: 0 })
  maxDiscount: number;

  @Prop()
  expiresAt?: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ lowercase: true, trim: true })
  assignedUserEmail?: string;

  @Prop({ default: 0 })
  usageCount: number;


  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
