import {
  Injectable,
  BadRequestException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';

const MAX_UNIQUE_ITEMS = 10; // max different products per cart
const MAX_QTY_PER_ITEM = 10; // max quantity of one product

@Injectable()
export class CartService implements OnModuleInit {
  constructor(
    @InjectModel(Cart.name)
    private readonly cartModel: Model<CartDocument>,
  ) {}

  async onModuleInit() {
    // No seeding needed
  }

  async getCart(userId: string): Promise<Cart> {
    let cart = await this.cartModel.findOne({ userId });
    if (!cart) {
      const now = new Date();
      cart = new this.cartModel({ userId, items: [], createdAt: now, updatedAt: now });
      await cart.save();
    }
    return cart;
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
    },
  ): Promise<Cart> {
    const qty = Number(data.quantity) || 1;

    if (qty < 1 || qty > MAX_QTY_PER_ITEM) {
      throw new BadRequestException(
        `Quantity must be between 1 and ${MAX_QTY_PER_ITEM}.`,
      );
    }

    let cart = await this.cartModel.findOne({ userId });
    if (!cart) {
      const now = new Date();
      cart = new this.cartModel({ userId, items: [], createdAt: now, updatedAt: now });
    }

    const existingIndex = cart.items.findIndex(
      (i) => i.productId === data.productId,
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
        productId: data.productId,
        name: data.name,
        image: data.image || '',
        price: Number(data.price) || 0,
        quantity: qty,
        size: data.size || '',
        color: data.color || '',
      });
    }

    cart.updatedAt = new Date();
    return cart.save();
  }

  async updateItemQuantity(
    userId: string,
    productId: string,
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

    const idx = cart.items.findIndex((i) => i.productId === productId);
    if (idx === -1) throw new NotFoundException('Item not found in cart.');

    cart.items[idx].quantity = qty;
    cart.updatedAt = new Date();
    return cart.save();
  }

  async removeItem(userId: string, productId: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) throw new NotFoundException('Cart not found.');

    const prevLength = cart.items.length;
    cart.items = cart.items.filter((i) => i.productId !== productId);

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
