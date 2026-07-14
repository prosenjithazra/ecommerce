import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderEntity } from './entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(): Promise<OrderEntity[]> {
    return this.ordersService.findAll();
  }

  @Post()
  async create(@Body() data: Partial<OrderEntity>): Promise<OrderEntity> {
    return this.ordersService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<OrderEntity>,
  ): Promise<OrderEntity> {
    return this.ordersService.update(id, data);
  }
}
