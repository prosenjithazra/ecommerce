import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WishlistDocument = Wishlist & Document;

@Schema({ timestamps: true, collection: 'wishlists' })
export class Wishlist {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({
    type: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        originalPrice: { type: Number, default: 0 },
        image: { type: String, default: '' },
        category: { type: String, default: '' },
        rating: { type: Number, default: 0 },
        reviewsCount: { type: Number, default: 0 },
        inStock: { type: Boolean, default: true },
      },
    ],
    default: [],
  })
  items: {
    productId: string;
    name: string;
    price: number;
    originalPrice: number;
    image: string;
    category: string;
    rating: number;
    reviewsCount: number;
    inStock: boolean;
  }[];

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);
