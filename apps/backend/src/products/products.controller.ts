import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductEntity } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(): Promise<ProductEntity[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductEntity | null> {
    return this.productsService.findOne(id);
  }

  @Post()
  async create(@Body() data: Partial<ProductEntity>): Promise<ProductEntity> {
    return this.productsService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<ProductEntity>,
  ): Promise<ProductEntity> {
    return this.productsService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }
}
