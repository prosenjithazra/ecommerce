import { Injectable, BadRequestException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon, CouponDocument } from './schemas/coupon.schema';
import { randomUUID } from 'crypto';

const INITIAL_COUPONS = [
  {
    id: 'c1',
    code: 'WELCOME10',
    discountType: 'percentage' as const,
    discountValue: 10,
    minOrderAmount: 499,
    maxDiscount: 500,
    isActive: true,
  },
  {
    id: 'c2',
    code: 'FLAT200',
    discountType: 'fixed' as const,
    discountValue: 200,
    minOrderAmount: 999,
    isActive: true,
  },
];

@Injectable()
export class CouponsService implements OnModuleInit {
  constructor(
    @InjectModel(Coupon.name)
    private readonly couponModel: Model<CouponDocument>,
  ) {}

  async onModuleInit() {
    // Seed default coupons if empty
    try {
      const count = await this.couponModel.countDocuments();
      if (count === 0) {
        const now = new Date();
        for (const item of INITIAL_COUPONS) {
          await this.couponModel.create({
            ...item,
            createdAt: now,
            updatedAt: now,
          });
        }
      }
    } catch (err) {
      console.error('Failed to seed initial coupons:', err);
    }
  }

  async findAll(userEmail?: string): Promise<Coupon[]> {
    if (userEmail && userEmail.trim()) {
      const cleanEmail = userEmail.trim().toLowerCase();
      return this.couponModel
        .find({
          $or: [
            { assignedUserEmail: { $exists: false } },
            { assignedUserEmail: null },
            { assignedUserEmail: '' },
            { assignedUserEmail: cleanEmail },
          ],
        })
        .sort({ createdAt: -1 });
    }
    return this.couponModel.find().sort({ createdAt: -1 });
  }

  async findOne(id: string): Promise<Coupon> {
    const coupon = await this.couponModel.findOne({ id });
    if (!coupon) throw new NotFoundException('Coupon not found');
    return coupon;
  }

  async create(data: Partial<Coupon>): Promise<Coupon> {
    if (!data.code || !data.discountValue) {
      throw new BadRequestException('Code and discount value are required');
    }
    const cleanCode = data.code.trim().toUpperCase();
    const existing = await this.couponModel.findOne({ code: cleanCode });
    if (existing) throw new BadRequestException(`Coupon code "${cleanCode}" already exists`);

    const now = new Date();
    const coupon = new this.couponModel({
      id: randomUUID(),
      code: cleanCode,
      discountType: data.discountType || 'percentage',
      discountValue: Number(data.discountValue) || 0,
      minOrderAmount: Number(data.minOrderAmount) || 0,
      maxDiscount: Number(data.maxDiscount) || 0,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      assignedUserEmail: data.assignedUserEmail ? data.assignedUserEmail.trim().toLowerCase() : undefined,
      isActive: data.isActive ?? true,
      usageCount: 0,
      createdAt: now,
      updatedAt: now,
    });
    return coupon.save();
  }

  async update(id: string, data: Partial<Coupon>): Promise<Coupon> {
    const coupon = await this.couponModel.findOne({ id });
    if (!coupon) throw new NotFoundException('Coupon not found');

    if (data.code && data.code.trim().toUpperCase() !== coupon.code) {
      const cleanCode = data.code.trim().toUpperCase();
      const existing = await this.couponModel.findOne({ code: cleanCode, id: { $ne: id } });
      if (existing) throw new BadRequestException(`Coupon code "${cleanCode}" already exists`);
      coupon.code = cleanCode;
    }

    if (data.discountType !== undefined) coupon.discountType = data.discountType;
    if (data.discountValue !== undefined) coupon.discountValue = Number(data.discountValue) || 0;
    if (data.minOrderAmount !== undefined) coupon.minOrderAmount = Number(data.minOrderAmount) || 0;
    if (data.maxDiscount !== undefined) coupon.maxDiscount = Number(data.maxDiscount) || 0;
    if (data.expiresAt !== undefined) coupon.expiresAt = data.expiresAt ? new Date(data.expiresAt) : undefined;
    if (data.assignedUserEmail !== undefined) coupon.assignedUserEmail = data.assignedUserEmail ? data.assignedUserEmail.trim().toLowerCase() : undefined;
    if (data.isActive !== undefined) coupon.isActive = data.isActive;

    coupon.updatedAt = new Date();
    return coupon.save();
  }

  async remove(id: string): Promise<void> {
    await this.couponModel.deleteOne({ id });
  }

  async validate(code: string, amount: number, userEmail?: string): Promise<{ valid: boolean; coupon: Coupon; discountAmount: number; message: string }> {
    if (!code || !code.trim()) {
      throw new BadRequestException('Coupon code is required');
    }

    const cleanCode = code.trim().toUpperCase();
    const coupon = await this.couponModel.findOne({ code: cleanCode });

    if (!coupon) {
      throw new BadRequestException('Invalid coupon code');
    }

    if (!coupon.isActive) {
      throw new BadRequestException('This coupon code is currently disabled');
    }

    if (coupon.assignedUserEmail && coupon.assignedUserEmail.trim() !== '') {
      if (!userEmail || userEmail.trim().toLowerCase() !== coupon.assignedUserEmail.toLowerCase()) {
        throw new BadRequestException('This coupon is exclusively assigned to another user account');
      }
    }

    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
      throw new BadRequestException('This coupon code has expired');
    }

    const orderAmount = Number(amount) || 0;
    if (coupon.minOrderAmount > 0 && orderAmount < coupon.minOrderAmount) {
      throw new BadRequestException(`Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon`);
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscount > 0) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      }
    } else {
      discountAmount = Math.min(orderAmount, coupon.discountValue);
    }

    discountAmount = Number(discountAmount.toFixed(2));

    return {
      valid: true,
      coupon,
      discountAmount,
      message: `Coupon "${coupon.code}" applied successfully! Saved ₹${discountAmount}.`,
    };
  }
}

