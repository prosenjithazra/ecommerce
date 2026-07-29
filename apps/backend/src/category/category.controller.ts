import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './schemas/category.schema';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string): Promise<Category | null> {
    return this.categoryService.findBySlug(slug);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category | null> {
    return this.categoryService.findOne(id);
  }

  @Post()
  async create(@Body() data: Partial<Category>): Promise<Category> {
    return this.categoryService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Category>,
  ): Promise<Category> {
    return this.categoryService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.categoryService.remove(id);
  }
}
