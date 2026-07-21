import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema({ timestamps: true, collection: 'carts' })
export class Cart {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({
    type: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        image: { type: String, default: '' },
        price: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
        size: { type: String, default: '' },
        color: { type: String, default: '' },
      },
    ],
    default: [],
  })
  items: {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
  }[];

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
