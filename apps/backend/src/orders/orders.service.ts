import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Order, OrderDocument } from './schemas/order.schema';
import { EmailService } from '../email/email.service';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class OrdersService implements OnModuleInit {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');
    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
    }
  }

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

  /**
   * Helper to ensure image URL is a public HTTPS URL (uploads base64 data URIs to Cloudinary if needed)
   */
  private async ensurePublicUrl(url: string | undefined): Promise<string> {
    const defaultSampleUrl = 'https://sgp1.digitaloceanspaces.com/cdn.qikink.com/erp2/assets/designs/83/1696668376.jpg';
    if (!url || typeof url !== 'string') return defaultSampleUrl;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;

    if (url.startsWith('data:image')) {
      try {
        const uploadRes = await cloudinary.uploader.upload(url, { folder: 'qikink_designs' });
        if (uploadRes && uploadRes.secure_url) {
          return uploadRes.secure_url;
        }
      } catch (err) {
        console.error('Error uploading base64 artwork to Cloudinary:', err);
      }
    }
    return defaultSampleUrl;
  }

  /**
   * Dynamically resolves Qikink SKU and search_from_my_products based on product specs and category
   */
  private resolveDynamicQikinkSku(item: any): { sku: string; searchFromMyProducts: number } {
    if (item.search_from_my_products === 1) {
      return {
        sku: item.sku || `${item.productId}-${item.size}-${item.color}`,
        searchFromMyProducts: 1,
      };
    }

    const colorName = item.color || 'White';
    const sizeName = item.size || 'M';
    const COLOR_CODES: Record<string, string> = {
      white: 'Wh', black: 'Bk', grey: 'Gy', navy: 'Ny', green: 'Gn', red: 'Rd', blue: 'Bl', yellow: 'Yl', maroon: 'Mr', pink: 'Pk',
    };
    const cCode = COLOR_CODES[colorName.toLowerCase()] || 'Wh';
    const sCode = sizeName || 'M';

    const candidateSku = item.sku || '';
    if (candidateSku && candidateSku.includes('-') && candidateSku.length >= 6 && !candidateSku.startsWith('PHT-') && !candidateSku.startsWith('PHH-')) {
      return {
        sku: candidateSku,
        searchFromMyProducts: 0,
      };
    }

    const catLower = `${item.category || ''} ${item.name || ''}`.toLowerCase();
    let basePrefix = 'MVnHs';
    if (catLower.includes('hoodie')) {
      basePrefix = 'MVnHs'; // Universal blank for direct print fulfillment
    } else if (catLower.includes('polo')) {
      basePrefix = 'MPlHs';
    } else if (catLower.includes('sweatshirt')) {
      basePrefix = 'MSwFs';
    } else if (catLower.includes('cap') || catLower.includes('accessory')) {
      basePrefix = 'ACpCv';
    } else if (catLower.includes('jacket')) {
      basePrefix = 'MJkSl';
    } else if (catLower.includes('mug')) {
      basePrefix = 'AMgCm';
    }

    return {
      sku: `${basePrefix}-${cCode}-${sCode}`,
      searchFromMyProducts: 0,
    };
  }

  /**
   * Submits order asynchronously to Qikink Custom API
   */
  private async pushOrderToQikink(orderData: any): Promise<any> {
    try {
      const clientId = this.configService.get<string>('QIKINK_CLIENT_ID') || '912432173059030';
      const clientSecret = this.configService.get<string>('QIKINK_CLIENT_SECRET') || 'da287a1f1d672166cb8822e61e22fbb4fb6bfcccbbb62eddb4bab68d66be1ea7';
      const baseUrl = this.configService.get<string>('QIKINK_API_URL') || 'https://api.qikink.com';

      // 1. Get Token via POST /api/token
      const tokenRes = await fetch(`${baseUrl}/api/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ ClientId: clientId, client_secret: clientSecret }),
      });

      if (!tokenRes.ok) {
        console.error('Qikink Token fetch failed:', await tokenRes.text());
        return null;
      }

      const tokenJson = await tokenRes.json();
      const token = tokenJson.Accesstoken || tokenJson.access_token;
      if (!token) return null;

      // 2. Prepare payload
      const rawOrderNo = String(orderData.id || orderData._id || '').replace(/[^a-zA-Z0-9]/g, '');
      const cleanOrderNum = rawOrderNo.length > 15 ? rawOrderNo.slice(-15) : (rawOrderNo || `ORD${Date.now().toString().slice(-8)}`);

      const itemsList = Array.isArray(orderData.itemsJson) ? orderData.itemsJson : [];
      const address = orderData.shippingAddress || itemsList[0]?.address || {
        fullName: orderData.customer || 'Customer',
        street: '123 Main Street',
        city: 'Bengaluru',
        state: 'Karnataka',
        zip: '560001',
        phone: '9876543210',
      };

      const rawPhone = (address.phone || '').replace(/\D/g, '');
      const cleanPhone = rawPhone.length >= 10 ? rawPhone.slice(-10) : '9876543210';
      const cleanZip = (address.zip || '560001').replace(/[^a-zA-Z0-9]/g, '') || '560001';

      const first_name = address.fullName ? address.fullName.split(' ')[0] || address.fullName : 'Customer';
      const last_name = address.fullName && address.fullName.includes(' ') ? address.fullName.split(' ').slice(1).join(' ') : '';

      const lineItems = await Promise.all(
        itemsList.map(async (item: any) => {
          const skuInfo = this.resolveDynamicQikinkSku(item);

          if (skuInfo.searchFromMyProducts === 1) {
            return {
              sku: skuInfo.sku,
              quantity: String(item.quantity || 1),
              price: String(item.price || 0),
              search_from_my_products: 1,
            };
          }

          const design = item.customDesign;
          const fallbackImg = await this.ensurePublicUrl(item.image);

          const rawFront = design?.rawFrontArtworkUrl || design?.frontDesignUrl || design?.front?.imageUrl || design?.front?.rawArtworkUrl;
          const rawFrontMockup = design?.frontMockupUrl || rawFront;

          const rawBack = design?.rawBackArtworkUrl || design?.backDesignUrl || design?.back?.imageUrl || design?.back?.rawArtworkUrl;
          const rawBackMockup = design?.backMockupUrl || rawBack;

          const frontDesignUrl = await this.ensurePublicUrl(rawFront || fallbackImg);
          const frontMockupUrl = await this.ensurePublicUrl(rawFrontMockup || frontDesignUrl);

          const backDesignUrl = rawBack ? await this.ensurePublicUrl(rawBack) : null;
          const backMockupUrl = rawBackMockup ? await this.ensurePublicUrl(rawBackMockup || backDesignUrl || '') : null;

          const designs: any[] = [];
          designs.push({
            design_code: `DSGNF${Date.now().toString().slice(-6)}`,
            placement_sku: 'fr',
            width_inches: '10',
            height_inches: '12',
            design_link: frontDesignUrl,
            mockup_link: frontMockupUrl,
          });

          if (backDesignUrl) {
            designs.push({
              design_code: `DSGNB${Date.now().toString().slice(-6)}`,
              placement_sku: 'bk',
              width_inches: '10',
              height_inches: '12',
              design_link: backDesignUrl,
              mockup_link: backMockupUrl || backDesignUrl,
            });
          }

          return {
            sku: skuInfo.sku,
            quantity: String(item.quantity || 1),
            price: String(item.price || 0),
            search_from_my_products: 0,
            print_type_id: 1,
            designs,
          };
        })
      );

      const qikPayload = {
        order_number: cleanOrderNum,
        qikink_shipping: '1',
        gateway: (orderData.paymentMethod || 'Prepaid').toUpperCase().includes('COD') ? 'COD' : 'Prepaid',
        total_order_value: String(orderData.total || 0),
        shipping_address: {
          first_name: first_name || 'Customer',
          last_name: last_name || '',
          address1: address.street || '123 Main Street',
          address2: '',
          phone: cleanPhone,
          email: orderData.email || 'customer@example.com',
          city: address.city || 'Bengaluru',
          zip: cleanZip,
          province: address.state || 'Karnataka',
          country_code: 'IN',
        },
        line_items: lineItems.length > 0 ? lineItems : [
          {
            sku: 'MVnHs-Wh-M',
            quantity: '1',
            price: String(orderData.total || 0),
            search_from_my_products: 0,
            print_type_id: 1,
            designs: [{
              design_code: `DSGNF${Date.now().toString().slice(-6)}`,
              placement_sku: 'fr',
              width_inches: '10',
              height_inches: '12',
              design_link: 'https://sgp1.digitaloceanspaces.com/cdn.qikink.com/erp2/assets/designs/83/1696668376.jpg',
              mockup_link: 'https://sgp1.digitaloceanspaces.com/cdn.qikink.com/erp2/assets/designs/83/1696668376.jpg',
            }],
          },
        ],
      };

      // 3. Post Order to Qikink /api/order/create
      const qikRes = await fetch(`${baseUrl}/api/order/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ClientId: clientId,
          Accesstoken: token,
        },
        body: JSON.stringify(qikPayload),
      });

      if (qikRes.ok) {
        const qikJson = await qikRes.json();
        console.log('Successfully created order in Qikink:', qikJson);
        return qikJson;
      } else {
        console.warn('Qikink Order creation warning:', await qikRes.text());
        return null;
      }
    } catch (err) {
      console.error('Error submitting order to Qikink:', err);
      return null;
    }
  }

  async create(data: Partial<Order>): Promise<Order> {
    if (data.paymentMethod === 'COD') {
      const itemsList = Array.isArray(data.itemsJson) ? data.itemsJson : [];
      const hasCustom = itemsList.some(item => 
        item.customDesign || 
        item.productId?.toLowerCase().includes('custom') || 
        item.name?.toLowerCase().includes('custom')
      );
      if (hasCustom) {
        throw new Error('Cash on Delivery (COD) is not available for custom/personalized products.');
      }
    }

    const now = new Date();
    const orderId = data.id || ('ORD-' + Math.floor(1000 + Math.random() * 9000));
    
    const order = new this.orderModel({
      id: orderId,
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

    // Send confirmation email asynchronously
    this.emailService.sendOrderConfirmationEmail(savedOrder).catch((err) => {
      console.error('Error sending order confirmation email asynchronously:', err);
    });

    // Automatically submit order to Qikink Custom API asynchronously
    this.pushOrderToQikink(savedOrder).then((qikinkResult) => {
      if (qikinkResult && (qikinkResult.order_id || qikinkResult.qikinkResponse?.order_id)) {
        const qId = String(qikinkResult.order_id || qikinkResult.qikinkResponse?.order_id);
        this.orderModel.updateOne({ id: savedOrder.id }, { qikinkOrderId: qId, qikinkStatus: 'Submitted' }).catch(() => {});
      }
    }).catch((err) => {
      console.error('Qikink async order push error:', err);
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
