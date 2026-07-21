import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true, collection: 'orders' })
export class Order {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  customer: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  date: string;

  @Prop({ default: 1 })
  items: number;

  @Prop({ required: true })
  total: number;

  @Prop({ default: 'Pending' })
  status: string;

  @Prop({ type: Object, default: null })
  itemsJson: any;

  @Prop({ default: null })
  paymentMethod: string;

  @Prop({ default: null })
  paymentId: string;

  @Prop({ default: null })
  paymentStatus: string;

  @Prop({ default: null })
  cancelReason: string;

  @Prop({ default: null })
  returnReason: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
