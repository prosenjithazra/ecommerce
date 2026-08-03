import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { Coupon } from './schemas/coupon.schema';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  async findAll(@Query('userEmail') userEmail?: string): Promise<Coupon[]> {
    return this.couponsService.findAll(userEmail);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Coupon> {
    return this.couponsService.findOne(id);
  }

  @Post('validate')
  async validate(@Body() body: { code: string; amount: number; userEmail?: string }) {
    return this.couponsService.validate(body.code, body.amount, body.userEmail);
  }


  @Post()
  async create(@Body() body: Partial<Coupon>): Promise<Coupon> {
    return this.couponsService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<Coupon>): Promise<Coupon> {
    return this.couponsService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    await this.couponsService.remove(id);
    return { success: true };
  }
}

