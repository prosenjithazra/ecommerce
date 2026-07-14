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
import { CategoryEntity } from './entities/category.entity';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll(): Promise<CategoryEntity[]> {
    return this.categoryService.findAll();
  }

  @Post()
  async create(@Body() data: Partial<CategoryEntity>): Promise<CategoryEntity> {
    return this.categoryService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<CategoryEntity>,
  ): Promise<CategoryEntity> {
    return this.categoryService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.categoryService.remove(id);
  }
}
