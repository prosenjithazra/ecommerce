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

  @Prop({ default: 0 })
  subtotal: number;

  @Prop({ default: 0 })
  tax: number;

  @Prop({ default: 0 })
  shippingFee: number;

  @Prop({ default: 0 })
  discountAmount: number;

  @Prop({ default: null })
  couponCode: string;

  @Prop({ default: 'Pending' })
  status: string;

  @Prop({ type: Object, default: null })
  itemsJson: any;

  @Prop({ type: Object, default: null })
  shippingAddress: any;

  @Prop({ type: Object, default: null })
  address: any;

  @Prop({ default: null })
  paymentMethod: string;

  @Prop({ default: null })
  paymentId: string;

  @Prop({ default: null })
  paymentStatus: string;

  @Prop({ default: 0 })
  paidAmount: number;

  @Prop({ default: 0 })
  codAmount: number;

  @Prop({ default: false })
  isPartialCod: boolean;

  @Prop({ default: null })
  cancelReason: string;

  @Prop({ default: null })
  returnReason: string;

  @Prop({ default: null })
  qikinkOrderId: string;

  @Prop({ default: null })
  qikinkStatus: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ email: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
