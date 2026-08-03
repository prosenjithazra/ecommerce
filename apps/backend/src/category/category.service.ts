import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { randomUUID } from 'crypto';

const slugify = (name: string): string =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const CACHE_KEY_ALL_CATEGORIES = 'cache_all_categories';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly cloudinaryService: CloudinaryService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  private async invalidateCache() {
    try {
      await this.cacheManager.del(CACHE_KEY_ALL_CATEGORIES);
    } catch (err) {}
  }

  private async attachProductCounts(categories: any[]): Promise<Category[]> {
    if (!categories || categories.length === 0) return [];
    
    // Only select minimal fields needed for counting
    const products = await this.productModel.find().select('categoryId category').lean();
    
    return categories.map((cat) => {
      const count = products.filter((p) => {
        if (p.categoryId && p.categoryId === cat.id) return true;
        if (p.category && p.category.toLowerCase() === cat.name.toLowerCase()) return true;
        if (p.category && slugify(p.category) === cat.slug) return true;
        return false;
      }).length;
      return { ...cat, count: count > 0 ? count : (cat.count || 0) };
    });
  }

  async findAll(): Promise<Category[]> {
    const cached = await this.cacheManager.get<Category[]>(CACHE_KEY_ALL_CATEGORIES);
    if (cached) return cached;

    const categories = await this.categoryModel.find().sort({ createdAt: 1 }).lean();
    const result = await this.attachProductCounts(categories);
    await this.cacheManager.set(CACHE_KEY_ALL_CATEGORIES, result, 300000);
    return result;
  }

  async findOne(id: string): Promise<Category | null> {
    let cat = await this.categoryModel.findOne({ id }).lean();
    if (!cat) cat = await this.categoryModel.findOne({ slug: id }).lean();
    if (!cat) return null;
    const [withCount] = await this.attachProductCounts([cat]);
    return withCount || null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    let cat = await this.categoryModel.findOne({ slug }).lean();
    if (!cat) cat = await this.categoryModel.findOne({ id: slug }).lean();
    if (!cat) return null;
    const [withCount] = await this.attachProductCounts([cat]);
    return withCount || null;
  }

  async create(data: Partial<Category>): Promise<Category> {
    const now = new Date();
    const uploadedImage = data.image ? await this.cloudinaryService.uploadImage(data.image) : '';
    const cat = new this.categoryModel({
      id: randomUUID(),
      name: data.name!,
      slug: data.slug || data.name!.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      count: data.count ?? 0,
      image: uploadedImage,
      description: data.description || '',
      status: data.status || 'Active',
      createdAt: now,
      updatedAt: now,
    });
    const saved = await cat.save();
    this.invalidateCache();
    return saved;
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    let cat = await this.categoryModel.findOne({ id });
    if (!cat) cat = await this.categoryModel.findOne({ slug: id });
    if (!cat) throw new Error('Category not found');

    if (data.name !== undefined) cat.name = data.name;
    if (data.slug !== undefined) cat.slug = data.slug;
    if (data.count !== undefined) cat.count = data.count;
    if (data.image !== undefined) {
      cat.image = data.image ? await this.cloudinaryService.uploadImage(data.image) : '';
    }
    if (data.description !== undefined) cat.description = data.description;
    if (data.status !== undefined) cat.status = data.status;
    cat.updatedAt = new Date();

    const saved = await cat.save();
    this.invalidateCache();
    return saved;
  }

  async remove(id: string): Promise<void> {
    await this.categoryModel.deleteOne({ id });
    this.invalidateCache();
  }
}
