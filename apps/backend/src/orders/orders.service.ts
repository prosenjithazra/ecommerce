import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Order, OrderDocument } from './schemas/order.schema';
import { EmailService } from '../email/email.service';

@Injectable()
export class OrdersService implements OnModuleInit {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async onModuleInit() {
    // Seeding optional
  }

  async findAll(email?: string): Promise<Order[]> {
    if (email) {
      return this.orderModel.find({ email }).sort({ createdAt: -1 });
    }
    return this.orderModel.find().sort({ createdAt: -1 });
  }

  async findOne(id: string): Promise<Order | null> {
    return this.orderModel.findOne({ id });
  }

  async create(data: Partial<Order>): Promise<Order> {
    const now = new Date();
    const order = new this.orderModel({
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      customer: data.customer!,
      email: data.email!,
      date: data.date || now.toISOString().split('T')[0],
      items: data.items ?? 1,
      total: Number(data.total) || 0,
      status: data.status || 'Pending',
      itemsJson: data.itemsJson || null,
      paymentMethod: data.paymentMethod || 'Pending',
      paymentId: data.paymentId || null,
      paymentStatus: data.paymentStatus || 'Pending',
      createdAt: now,
      updatedAt: now,
    });

    const savedOrder = await order.save();

    this.emailService.sendOrderConfirmationEmail(savedOrder).catch((err) => {
      console.error('Error sending order confirmation email asynchronously:', err);
    });

    return savedOrder;
  }

  async update(id: string, data: Partial<Order>): Promise<Order> {
    const order = await this.orderModel.findOne({ id });
    if (!order) throw new Error('Order not found');

    if (data.status !== undefined) order.status = data.status;
    if (data.paymentMethod !== undefined) order.paymentMethod = data.paymentMethod;
    if (data.paymentId !== undefined) order.paymentId = data.paymentId;
    if (data.paymentStatus !== undefined) order.paymentStatus = data.paymentStatus;
    if (data.cancelReason !== undefined) order.cancelReason = data.cancelReason;
    if (data.returnReason !== undefined) order.returnReason = data.returnReason;
    order.updatedAt = new Date();

    return order.save();
  }

  async createRazorpayOrder(amount: number) {
    const keyId = this.configService.get<string>('RAZORPAY_KEY_ID');
    const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');

    const numAmount = Number(amount) || 1;
    const amountInPaise = Math.round(numAmount * 100);

    if (!keyId || !keySecret) {
      console.log('Razorpay keys not configured. Simulating order creation...');
      const simulatedId = 'order_sim_' + Math.random().toString(36).substring(2, 12);
      return {
        id: simulatedId,
        amount: amountInPaise,
        currency: 'INR',
        key: 'rzp_test_simulated_key',
        simulated: true,
      };
    }

    try {
      const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: 'receipt_order_' + Date.now(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Razorpay API error response:', errorText);
        throw new Error(`Razorpay API error: ${errorText}`);
      }

      const orderData = await response.json();
      return {
        id: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        key: keyId,
        simulated: false,
      };
    } catch (error: any) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  }

  async verifyRazorpayPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
  ): Promise<boolean> {
    const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');

    if (!keySecret || razorpayOrderId.startsWith('order_sim_')) {
      console.log('Skipping Razorpay signature verification (Sandbox mode)');
      return true;
    }

    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    return generatedSignature === razorpaySignature;
  }
}
