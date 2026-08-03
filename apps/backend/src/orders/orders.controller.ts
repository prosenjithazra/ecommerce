import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './schemas/order.schema';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(@Query('email') email?: string): Promise<Order[]> {
    return this.ordersService.findAll(email);
  }

  @Post()
  async create(@Body() data: Partial<Order>): Promise<Order> {
    return this.ordersService.create(data);
  }

  @Post('razorpay-create')
  async createRazorpayOrder(@Body('amount') amount: number) {
    return this.ordersService.createRazorpayOrder(amount);
  }

  @Post('razorpay-verify')
  async verifyRazorpayPayment(
    @Body('razorpayOrderId') razorpayOrderId: string,
    @Body('razorpayPaymentId') razorpayPaymentId: string,
    @Body('razorpaySignature') razorpaySignature: string,
  ) {
    const verified = await this.ordersService.verifyRazorpayPayment(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    );
    return { verified };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Order | null> {
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Order>,
  ): Promise<Order> {
    return this.ordersService.update(id, data);
  }
}
