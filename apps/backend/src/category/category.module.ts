import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryEntity } from './entities/category.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity]), CloudinaryModule],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
