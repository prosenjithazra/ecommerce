import {
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wishlist, WishlistDocument } from './schemas/wishlist.schema';

@Injectable()
export class WishlistService implements OnModuleInit {
  constructor(
    @InjectModel(Wishlist.name)
    private readonly wishlistModel: Model<WishlistDocument>,
  ) {}

  async onModuleInit() {
    // No seeding needed
  }

  async getWishlist(userId: string): Promise<Wishlist> {
    let wishlist = await this.wishlistModel.findOne({ userId });
    if (!wishlist) {
      const now = new Date();
      wishlist = new this.wishlistModel({ userId, items: [], createdAt: now, updatedAt: now });
      await wishlist.save();
    }
    return wishlist;
  }

  async toggleItem(
    userId: string,
    data: {
      productId: string;
      name: string;
      price: number;
      originalPrice?: number;
      image?: string;
      category?: string;
      rating?: number;
      reviewsCount?: number;
      inStock?: boolean;
    },
  ): Promise<{ wishlist: Wishlist; added: boolean }> {
    let wishlist = await this.wishlistModel.findOne({ userId });
    if (!wishlist) {
      const now = new Date();
      wishlist = new this.wishlistModel({ userId, items: [], createdAt: now, updatedAt: now });
    }

    const existingIndex = wishlist.items.findIndex(
      (i) => i.productId === data.productId,
    );

    let added: boolean;
    if (existingIndex !== -1) {
      // Remove from wishlist
      wishlist.items = wishlist.items.filter((i) => i.productId !== data.productId);
      added = false;
    } else {
      // Add to wishlist
      wishlist.items.push({
        productId: data.productId,
        name: data.name,
        price: Number(data.price) || 0,
        originalPrice: Number(data.originalPrice) || 0,
        image: data.image || '',
        category: data.category || '',
        rating: Number(data.rating) || 0,
        reviewsCount: Number(data.reviewsCount) || 0,
        inStock: data.inStock ?? true,
      });
      added = true;
    }

    wishlist.updatedAt = new Date();
    const saved = await wishlist.save();
    return { wishlist: saved, added };
  }

  async removeItem(userId: string, productId: string): Promise<Wishlist> {
    const wishlist = await this.wishlistModel.findOne({ userId });
    if (!wishlist) throw new NotFoundException('Wishlist not found.');

    const prevLength = wishlist.items.length;
    wishlist.items = wishlist.items.filter((i) => i.productId !== productId);

    if (wishlist.items.length === prevLength) {
      throw new NotFoundException('Item not found in wishlist.');
    }

    wishlist.updatedAt = new Date();
    return wishlist.save();
  }

  async clearWishlist(userId: string): Promise<Wishlist> {
    const wishlist = await this.wishlistModel.findOne({ userId });
    if (!wishlist) throw new NotFoundException('Wishlist not found.');

    wishlist.items = [];
    wishlist.updatedAt = new Date();
    return wishlist.save();
  }
}
