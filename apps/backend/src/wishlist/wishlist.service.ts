import {
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wishlist, WishlistDocument } from './schemas/wishlist.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';

@Injectable()
export class WishlistService implements OnModuleInit {
  constructor(
    @InjectModel(Wishlist.name)
    private readonly wishlistModel: Model<WishlistDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async onModuleInit() {
    // No seeding needed
  }

  private async filterValidWishlistItems(items: any[]): Promise<any[]> {
    if (!items || items.length === 0) return [];
    const productIdsToCheck = Array.from(
      new Set(items.map((i) => i.productId).filter(Boolean)),
    );
    if (productIdsToCheck.length === 0) return items;

    const existingProducts = await this.productModel
      .find({
        $or: [
          { id: { $in: productIdsToCheck } },
          { slug: { $in: productIdsToCheck } },
        ],
      })
      .select('id slug')
      .lean();

    const validIdSet = new Set<string>();
    existingProducts.forEach((p) => {
      if (p.id) validIdSet.add(p.id);
      if (p.slug) validIdSet.add(p.slug);
    });

    return items.filter((item) => validIdSet.has(item.productId));
  }

  async getWishlist(userId: string): Promise<Wishlist> {
    let wishlist = await this.wishlistModel.findOne({ userId });
    if (!wishlist) {
      const now = new Date();
      wishlist = new this.wishlistModel({ userId, items: [], createdAt: now, updatedAt: now });
      await wishlist.save();
      return wishlist.toObject() as unknown as Wishlist;
    }

    const originalCount = wishlist.items.length;
    const validItems = await this.filterValidWishlistItems(wishlist.items);

    if (validItems.length !== originalCount) {
      wishlist.items = validItems;
      wishlist.updatedAt = new Date();
      await wishlist.save();
    }

    return wishlist.toObject() as unknown as Wishlist;
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
    // Validate if product exists in store database when adding
    const existingIndexCheck = (await this.wishlistModel.findOne({ userId }))?.items?.findIndex(
      (i) => i.productId === data.productId,
    );

    if (existingIndexCheck === undefined || existingIndexCheck === -1) {
      const exists = await this.productModel.findOne({
        $or: [{ id: data.productId }, { slug: data.productId }],
      }).select('id').lean();

      if (!exists) {
        throw new NotFoundException('Product no longer exists in store database.');
      }
    }

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
