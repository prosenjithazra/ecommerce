import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query('category') category?: string,
    @Query('categoryId') categoryId?: string,
    @Query('homeSection') homeSection?: string,
    @Query('targetGender') targetGender?: string,
  ): Promise<Product[]> {
    if (homeSection || targetGender) {
      return this.productsService.filterProducts({ homeSection, targetGender, category, categoryId });
    }
    if (categoryId) {
      return this.productsService.findByCategory(categoryId);
    }
    if (category) {
      return this.productsService.findByCategory(category);
    }
    return this.productsService.findAll();
  }

  @Get('category/:category')
  async findByCategory(
    @Param('category') category: string,
  ): Promise<Product[]> {
    return this.productsService.findByCategory(category);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string): Promise<Product | null> {
    return this.productsService.findBySlug(slug);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product | null> {
    return this.productsService.findOne(id);
  }

  @Post()
  async create(@Body() data: Partial<Product>): Promise<Product> {
    return this.productsService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Product>,
  ): Promise<Product> {
    return this.productsService.update(id, data);
  }

  @Delete('clear/all')
  async clearAll(): Promise<{ deletedCount: number }> {
    return this.productsService.removeAll();
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }
}
