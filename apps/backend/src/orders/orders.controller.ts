import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderEntity } from './entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(@Query('email') email?: string): Promise<OrderEntity[]> {
    return this.ordersService.findAll(email);
  }

  @Post()
  async create(@Body() data: Partial<OrderEntity>): Promise<OrderEntity> {
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
  async findOne(@Param('id') id: string): Promise<OrderEntity | null> {
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<OrderEntity>,
  ): Promise<OrderEntity> {
    return this.ordersService.update(id, data);
  }
}
