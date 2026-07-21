import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { randomUUID } from 'crypto';

@Injectable()
export class CategoryService implements OnModuleInit {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async onModuleInit() {
    // Seeding optional
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().sort({ createdAt: 1 });
  }

  async findOne(id: string): Promise<Category | null> {
    return this.categoryModel.findOne({ id });
  }

  async create(data: Partial<Category>): Promise<Category> {
    const now = new Date();
    const cat = new this.categoryModel({
      id: randomUUID(),
      name: data.name!,
      slug: data.slug || data.name!.toLowerCase().replace(/\s+/g, '-'),
      count: data.count ?? 0,
      image: data.image!,
      status: data.status || 'Active',
      createdAt: now,
      updatedAt: now,
    });
    return cat.save();
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    const cat = await this.categoryModel.findOne({ id });
    if (!cat) throw new Error('Category not found');

    if (data.name !== undefined) cat.name = data.name;
    if (data.slug !== undefined) cat.slug = data.slug;
    if (data.count !== undefined) cat.count = data.count;
    if (data.image !== undefined) cat.image = data.image;
    if (data.status !== undefined) cat.status = data.status;
    cat.updatedAt = new Date();

    return cat.save();
  }

  async remove(id: string): Promise<void> {
    await this.categoryModel.deleteOne({ id });
  }
}
