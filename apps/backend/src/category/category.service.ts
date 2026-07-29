import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { randomUUID } from 'crypto';

const slugify = (name: string): string =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

@Injectable()
export class CategoryService implements OnModuleInit {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async onModuleInit() {
    // Seeding optional
  }

  private async attachProductCounts(categories: CategoryDocument[]): Promise<Category[]> {
    const products = await this.productModel.find();
    return categories.map((cat) => {
      const catObj = cat.toObject ? cat.toObject() : cat;
      const count = products.filter((p) => {
        if (p.categoryId && p.categoryId === cat.id) return true;
        if (p.category && p.category.toLowerCase() === cat.name.toLowerCase()) return true;
        if (p.category && slugify(p.category) === cat.slug) return true;
        return false;
      }).length;
      return { ...catObj, count };
    });
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.categoryModel.find().sort({ createdAt: 1 });
    return this.attachProductCounts(categories);
  }

  async findOne(id: string): Promise<Category | null> {
    let cat = await this.categoryModel.findOne({ id });
    if (!cat) cat = await this.categoryModel.findOne({ slug: id });
    if (!cat) return null;
    const [withCount] = await this.attachProductCounts([cat]);
    return withCount || null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    let cat = await this.categoryModel.findOne({ slug });
    if (!cat) cat = await this.categoryModel.findOne({ id: slug });
    if (!cat) return null;
    const [withCount] = await this.attachProductCounts([cat]);
    return withCount || null;
  }

  async create(data: Partial<Category>): Promise<Category> {
    const now = new Date();
    const cat = new this.categoryModel({
      id: randomUUID(),
      name: data.name!,
      slug: data.slug || data.name!.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      count: data.count ?? 0,
      image: data.image!,
      description: data.description || '',
      status: data.status || 'Active',
      createdAt: now,
      updatedAt: now,
    });
    return cat.save();
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    let cat = await this.categoryModel.findOne({ id });
    if (!cat) cat = await this.categoryModel.findOne({ slug: id });
    if (!cat) throw new Error('Category not found');

    if (data.name !== undefined) cat.name = data.name;
    if (data.slug !== undefined) cat.slug = data.slug;
    if (data.count !== undefined) cat.count = data.count;
    if (data.image !== undefined) cat.image = data.image;
    if (data.description !== undefined) cat.description = data.description;
    if (data.status !== undefined) cat.status = data.status;
    cat.updatedAt = new Date();

    return cat.save();
  }

  async remove(id: string): Promise<void> {
    await this.categoryModel.deleteOne({ id });
  }
}
