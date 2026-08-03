import {
  Injectable,
  BadRequestException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import * as crypto from 'crypto';

const MAX_UNIQUE_ITEMS = 20; // max different products/designs per cart
const MAX_QTY_PER_ITEM = 50; // max quantity per slot (custom bulk orders)

@Injectable()
export class CartService implements OnModuleInit {
  constructor(
    @InjectModel(Cart.name)
    private readonly cartModel: Model<CartDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async onModuleInit() {
    // No seeding needed
  }

  private async filterValidCartItems(items: any[]): Promise<any[]> {
    if (!items || items.length === 0) return [];
    const productIdsToCheck = Array.from(
      new Set(
        items
          .map((i) => i.productId)
          .filter(
            (id) => id && id !== 'custom' && id !== 'standard' && !id.startsWith('p-custom-'),
          ),
      ),
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

    return items.filter((item) => {
      if (item.customDesign || item.productId === 'custom' || item.productId === 'standard' || item.productId?.startsWith('p-custom-')) {
        return true;
      }
      return validIdSet.has(item.productId);
    });
  }

  async getCart(userId: string): Promise<Cart> {
    let cart = await this.cartModel.findOne({ userId });
    if (!cart) {
      const now = new Date();
      cart = new this.cartModel({ userId, items: [], createdAt: now, updatedAt: now });
      await cart.save();
      return cart.toObject() as unknown as Cart;
    }

    const originalCount = cart.items.length;
    const validItems = await this.filterValidCartItems(cart.items);

    if (validItems.length !== originalCount) {
      cart.items = validItems;
      cart.updatedAt = new Date();
      await cart.save();
    }

    return cart.toObject() as unknown as Cart;
  }

  async addItem(
    userId: string,
    data: {
      productId: string;
      name: string;
      image?: string;
      price: number;
      quantity?: number;
      size?: string;
      color?: string;
      customDesign?: any;
    },
  ): Promise<Cart> {
    const qty = Number(data.quantity) || 1;

    if (qty < 1 || qty > MAX_QTY_PER_ITEM) {
      throw new BadRequestException(
        `Quantity must be between 1 and ${MAX_QTY_PER_ITEM}.`,
      );
    }

    // Verify underlying product exists in database (unless custom design)
    if (!data.customDesign && data.productId && data.productId !== 'custom' && data.productId !== 'standard') {
      const exists = await this.productModel.findOne({
        $or: [{ id: data.productId }, { slug: data.productId }],
      }).select('id').lean();

      if (!exists) {
        throw new NotFoundException('Product no longer exists in store database.');
      }
    }

    let cart = await this.cartModel.findOne({ userId });
    if (!cart) {
      const now = new Date();
      cart = new this.cartModel({ userId, items: [], createdAt: now, updatedAt: now });
    }

    // For custom designs: each unique design is always a NEW cart slot (never merge).
    // For regular products (no customDesign): merge by productId + size + color.
    const isCustom = !!data.customDesign;

    if (!isCustom) {
      // Find an existing slot for the same product + size + color (standard merge)
      const existingIndex = cart.items.findIndex(
        (i) =>
          i.productId === data.productId &&
          i.size === (data.size || '') &&
          i.color === (data.color || '') &&
          !i.customDesign,
      );

      if (existingIndex !== -1) {
        const newQty = cart.items[existingIndex].quantity + qty;
        if (newQty > MAX_QTY_PER_ITEM) {
          throw new BadRequestException(
            `Maximum quantity for a single item is ${MAX_QTY_PER_ITEM}.`,
          );
        }
        cart.items[existingIndex].quantity = newQty;
      } else {
        if (cart.items.length >= MAX_UNIQUE_ITEMS) {
          throw new BadRequestException(
            `Cart is full. Maximum ${MAX_UNIQUE_ITEMS} different products allowed.`,
          );
        }
        cart.items.push({
          cartItemId: crypto.randomUUID(),
          productId: data.productId,
          name: data.name,
          image: data.image || '',
          price: Number(data.price) || 0,
          quantity: qty,
          size: data.size || '',
          color: data.color || '',
          customDesign: null,
        });
      }
    } else {
      // Custom design: always add as a NEW slot with its own cartItemId
      if (cart.items.length >= MAX_UNIQUE_ITEMS) {
        throw new BadRequestException(
          `Cart is full. Maximum ${MAX_UNIQUE_ITEMS} different products allowed.`,
        );
      }
      cart.items.push({
        cartItemId: crypto.randomUUID(),
        productId: data.productId,
        name: data.name,
        image: data.image || '',
        price: Number(data.price) || 0,
        quantity: qty,
        size: data.size || '',
        color: data.color || '',
        customDesign: data.customDesign,
      });
    }

    cart.updatedAt = new Date();
    return cart.save();
  }

  async updateItemQuantity(
    userId: string,
    cartItemId: string,
    quantity: number,
  ): Promise<Cart> {
    const qty = Number(quantity);
    if (!qty || qty < 1 || qty > MAX_QTY_PER_ITEM) {
      throw new BadRequestException(
        `Quantity must be between 1 and ${MAX_QTY_PER_ITEM}.`,
      );
    }

    const cart = await this.cartModel.findOne({ userId });
    if (!cart) throw new NotFoundException('Cart not found.');

    // Try cartItemId first, fall back to productId for backwards compatibility
    let idx = cart.items.findIndex((i) => i.cartItemId === cartItemId);
    if (idx === -1) idx = cart.items.findIndex((i) => i.productId === cartItemId);
    if (idx === -1) throw new NotFoundException('Item not found in cart.');

    cart.items[idx].quantity = qty;
    cart.updatedAt = new Date();
    return cart.save();
  }

  async removeItem(userId: string, cartItemId: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) throw new NotFoundException('Cart not found.');

    const prevLength = cart.items.length;

    // Prefer exact cartItemId match (new items). For legacy items without cartItemId,
    // fall back to productId match — but only remove ONE item to avoid bulk deletion.
    const byCartItemId = cart.items.findIndex((i) => i.cartItemId === cartItemId);
    if (byCartItemId !== -1) {
      cart.items.splice(byCartItemId, 1);
    } else {
      // Legacy fallback: remove first item matching by productId
      const byProductId = cart.items.findIndex((i) => i.productId === cartItemId);
      if (byProductId === -1) throw new NotFoundException('Item not found in cart.');
      cart.items.splice(byProductId, 1);
    }

    if (cart.items.length === prevLength) {
      throw new NotFoundException('Item not found in cart.');
    }

    cart.updatedAt = new Date();
    return cart.save();
  }

  async clearCart(userId: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) throw new NotFoundException('Cart not found.');

    cart.items = [];
    cart.updatedAt = new Date();
    return cart.save();
  }
}
