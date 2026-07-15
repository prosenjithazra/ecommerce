import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { OrderEntity } from './entities/order.entity';

@Injectable()
export class OrdersService implements OnModuleInit {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    // Disable automatic seeding as per user request to manage orders dynamically only
    // await this.seedOrders();
  }

  private async seedOrders() {
    try {
      const count = await this.orderRepository.count();
      if (count > 0) return;

      const initial = [
        {
          id: 'ORD-9872',
          customer: 'Jane Doe',
          email: 'jane.doe@example.com',
          date: '2026-07-08',
          items: 2,
          total: 4598,
          status: 'Delivered',
        },
        {
          id: 'ORD-4819',
          customer: 'Alex Mercer',
          email: 'alex.mercer@gmail.com',
          date: '2026-07-12',
          items: 3,
          total: 8040,
          status: 'Processing',
        },
        {
          id: 'ORD-2391',
          customer: 'Sarah Connor',
          email: 's.connor@cyberdyne.org',
          date: '2026-07-13',
          items: 1,
          total: 2299,
          status: 'Pending',
        },
        {
          id: 'ORD-1104',
          customer: 'Mark Wells',
          email: 'mark.w@example.com',
          date: '2026-07-11',
          items: 4,
          total: 12840,
          status: 'Shipped',
        },
        {
          id: 'ORD-7761',
          customer: 'Priya Sharma',
          email: 'priya.s@gmail.com',
          date: '2026-07-09',
          items: 1,
          total: 1699,
          status: 'Cancelled',
        },
      ];

      const now = new Date();
      for (const item of initial) {
        const order = new OrderEntity();
        order.id = item.id;
        order.customer = item.customer;
        order.email = item.email;
        order.date = item.date;
        order.items = item.items;
        order.total = item.total;
        order.status = item.status;
        order.createdAt = now;
        order.updatedAt = now;
        await this.orderRepository.save(order);
      }
      console.log('Seeded initial orders successfully.');
    } catch (err) {
      console.error('Error seeding orders:', err);
    }
  }

  async findAll(email?: string): Promise<OrderEntity[]> {
    if (email) {
      return this.orderRepository.find({
        where: { email },
        order: { createdAt: 'DESC' },
      });
    }
    return this.orderRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<OrderEntity | null> {
    return this.orderRepository.findOne({ where: { id } });
  }

  async create(data: Partial<OrderEntity>): Promise<OrderEntity> {
    const now = new Date();
    const order = new OrderEntity();
    order.id = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    order.customer = data.customer!;
    order.email = data.email!;
    order.date = data.date || now.toISOString().split('T')[0];
    order.items = data.items ?? 1;
    order.total = Number(data.total) || 0;
    order.status = data.status || 'Pending';
    order.itemsJson = data.itemsJson || null;
    order.paymentMethod = data.paymentMethod || 'Pending';
    order.paymentId = data.paymentId || null;
    order.paymentStatus = data.paymentStatus || 'Pending';
    order.createdAt = now;
    order.updatedAt = now;
    return this.orderRepository.save(order);
  }

  async update(id: string, data: Partial<OrderEntity>): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new Error('Order not found');

    if (data.status !== undefined) order.status = data.status;
    if (data.paymentMethod !== undefined) order.paymentMethod = data.paymentMethod;
    if (data.paymentId !== undefined) order.paymentId = data.paymentId;
    if (data.paymentStatus !== undefined) order.paymentStatus = data.paymentStatus;
    if (data.cancelReason !== undefined) order.cancelReason = data.cancelReason;
    if (data.returnReason !== undefined) order.returnReason = data.returnReason;
    order.updatedAt = new Date();

    return this.orderRepository.save(order);
  }

  async createRazorpayOrder(amount: number) {
    const keyId = this.configService.get<string>('RAZORPAY_KEY_ID');
    const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');

    // Convert amount to paise (subunit)
    const amountInPaise = Math.round(amount * 100);

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
    } catch (error) {
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
