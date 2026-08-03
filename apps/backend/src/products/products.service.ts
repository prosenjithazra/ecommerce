import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Product, ProductDocument } from './schemas/product.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { randomUUID } from 'crypto';

const slugify = (name: string): string =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const CACHE_KEY_ALL_PRODUCTS = 'cache_all_products';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly cloudinaryService: CloudinaryService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async onModuleInit() {
    // Non-blocking background migration for missing slugs
    setImmediate(async () => {
      try {
        const unslugged = await this.productModel
          .find({ $or: [{ slug: { $exists: false } }, { slug: '' }] })
          .select('_id name id')
          .lean();

        if (unslugged.length > 0) {
          const bulkOps = unslugged.map((p) => {
            const baseSlug = slugify(p.name || 'product');
            const calculatedSlug = `${baseSlug}-${(p.id || String(p._id)).slice(0, 6)}`;
            return {
              updateOne: {
                filter: { _id: p._id },
                update: { $set: { slug: calculatedSlug } },
              },
            };
          });
          await this.productModel.bulkWrite(bulkOps);
        }
      } catch (err) {
        // Quiet background catch
      }
    });
  }

  private async invalidateCache() {
    try {
      await this.cacheManager.del(CACHE_KEY_ALL_PRODUCTS);
    } catch (err) {}
  }

  async findAll(): Promise<Product[]> {
    const cached = await this.cacheManager.get<Product[]>(CACHE_KEY_ALL_PRODUCTS);
    if (cached) return cached;

    const products = await this.productModel.find().sort({ createdAt: -1 }).lean();
    for (const p of products) {
      if (!p.slug || p.slug.trim() === '') {
        p.slug = slugify(p.name || 'product');
      }
    }

    await this.cacheManager.set(CACHE_KEY_ALL_PRODUCTS, products, 300000);
    return products;
  }

  async findOne(id: string): Promise<Product | null> {
    const cacheKey = `cache_prod_id_${id}`;
    const cached = await this.cacheManager.get<Product>(cacheKey);
    if (cached) return cached;

    let prod = await this.productModel.findOne({ id }).lean();
    if (!prod) {
      prod = await this.productModel.findOne({ slug: id }).lean();
    }
    if (prod && (!prod.slug || prod.slug.trim() === '')) {
      prod.slug = slugify(prod.name || 'product');
    }

    if (prod) {
      await this.cacheManager.set(cacheKey, prod, 300000);
    }
    return prod;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const cacheKey = `cache_prod_slug_${slug}`;
    const cached = await this.cacheManager.get<Product>(cacheKey);
    if (cached) return cached;

    let prod = await this.productModel.findOne({ slug }).lean();
    if (prod) {
      await this.cacheManager.set(cacheKey, prod, 300000);
      return prod;
    }

    prod = await this.productModel.findOne({ id: slug }).lean();
    if (prod) {
      if (!prod.slug || prod.slug.trim() === '') {
        const newSlug = slugify(prod.name || 'product');
        await this.productModel.updateOne({ id: prod.id }, { $set: { slug: newSlug } });
        prod.slug = newSlug;
        this.invalidateCache();
      }
      await this.cacheManager.set(cacheKey, prod, 300000);
      return prod;
    }

    // Single query projection fallback
    const all = await this.productModel.find().select('id name slug').lean();
    for (const p of all) {
      if (slugify(p.name || '') === slug) {
        await this.productModel.updateOne({ id: p.id }, { $set: { slug } });
        this.invalidateCache();
        return this.findOne(p.id);
      }
    }

    return null;
  }

  async findByCategory(categoryOrId: string): Promise<Product[]> {
    const cacheKey = `cache_cat_prods_${categoryOrId}`;
    const cached = await this.cacheManager.get<Product[]>(cacheKey);
    if (cached) return cached;

    const trimmed = (categoryOrId || '').trim();
    const flexPattern = trimmed.replace(/[-_\s]+/g, '[-_\\s]*');
    const flexRegex = new RegExp(`^${flexPattern}$`, 'i');
    const containRegex = new RegExp(flexPattern, 'i');

    const products = await this.productModel
      .find({
        $or: [
          { categoryId: trimmed },
          { category: { $regex: flexRegex } },
          { category: { $regex: containRegex } },
          { targetGender: { $regex: flexRegex } },
        ],
      })
      .sort({ createdAt: -1 })
      .lean();

    await this.cacheManager.set(cacheKey, products, 300000);
    return products;
  }

  async filterProducts(filters: {
    homeSection?: string;
    targetGender?: string;
    category?: string;
    categoryId?: string;
  }): Promise<Product[]> {
    const mongoQuery: any = {};

    if (filters.categoryId) {
      mongoQuery.categoryId = filters.categoryId;
    }

    if (filters.category) {
      const catQuery = filters.category.trim();
      const flexPattern = catQuery.replace(/[-_\s]+/g, '[-_\\s]*');
      const flexRegex = new RegExp(`^${flexPattern}$`, 'i');
      const containRegex = new RegExp(flexPattern, 'i');

      mongoQuery.$or = [
        { category: { $regex: flexRegex } },
        { category: { $regex: containRegex } },
        { categoryId: catQuery },
        { targetGender: { $regex: flexRegex } },
      ];
    }

    if (filters.homeSection) {
      const secQuery = filters.homeSection.trim();
      const secRegex = new RegExp(`^${secQuery.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}$`, 'i');

      const sectionCondition = {
        $or: [
          { homeSection: { $regex: secRegex } },
          { tag: { $regex: secRegex } },
        ],
      };

      if (mongoQuery.$or) {
        mongoQuery.$and = [{ $or: mongoQuery.$or }, sectionCondition];
        delete mongoQuery.$or;
      } else {
        mongoQuery.$or = sectionCondition.$or;
      }
    }

    if (filters.targetGender) {
      const genQuery = filters.targetGender.trim().toLowerCase();
      if (genQuery === 'men') {
        mongoQuery.targetGender = { $in: ['Men', 'men', 'Both', 'both'] };
      } else if (genQuery === 'women') {
        mongoQuery.targetGender = { $in: ['Women', 'women', 'Both', 'both'] };
      } else if (genQuery !== 'both') {
        mongoQuery.targetGender = new RegExp(`^${genQuery}$`, 'i');
      }
    }

    return this.productModel.find(mongoQuery).sort({ createdAt: -1 }).lean();
  }

  async findByHomeSection(section: string): Promise<Product[]> {
    return this.filterProducts({ homeSection: section });
  }

  async findByTargetGender(gender: string): Promise<Product[]> {
    return this.filterProducts({ targetGender: gender });
  }

  async create(data: Partial<Product>): Promise<Product> {
    const now = new Date();
    const name = data.name || 'Custom Product';
    const baseSlug = slugify(name);
    let slug = baseSlug;

    const existing = await this.productModel.findOne({ slug }).select('_id').lean();
    if (existing) slug = `${baseSlug}-${Date.now().toString(36)}`;

    let userSku = (data.sku || '').trim();
    if (!userSku) {
      userSku = 'SKU-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 1000);
    } else {
      const existingSku = await this.productModel.findOne({ sku: userSku }).select('_id').lean();
      if (existingSku) {
        userSku = `${userSku}-${Math.floor(100 + Math.random() * 900)}`;
      }
    }

    const rawHomeSection = data.homeSection as any;
    const homeSection: string[] = Array.isArray(rawHomeSection)
      ? rawHomeSection.map((s: any) => String(s).trim()).filter(Boolean)
      : typeof rawHomeSection === 'string' && rawHomeSection.trim()
        ? [rawHomeSection.trim()]
        : [];

    const uploadedImage = data.image ? await this.cloudinaryService.uploadImage(data.image) : '';
    const uploadedImages = Array.isArray(data.images) && data.images.length > 0
      ? await Promise.all(data.images.map((img) => this.cloudinaryService.uploadImage(img)))
      : [];

    const prod = new this.productModel({
      id: data.id || randomUUID(),
      name,
      slug,
      price: Number(data.price) || 0,
      originalPrice: Number(data.originalPrice) || 0,
      rating: Number(data.rating) || 5.0,
      reviewsCount: Number(data.reviewsCount) || 0,
      image: uploadedImage,
      images: uploadedImages,
      category: data.category || 'T-Shirts',
      categoryId: data.categoryId || '',
      tag: data.tag || '',
      description: data.description || '',
      colors: data.colors || [],
      sizes: data.sizes || [],
      inStock: data.inStock ?? true,
      sku: userSku,
      skuMapping: data.skuMapping || {},
      isQikinkSynced: data.isQikinkSynced ?? true,
      homeSection,
      targetGender: data.targetGender || 'Both',
      createdAt: now,
      updatedAt: now,
    });

    const saved = await prod.save();
    this.invalidateCache();
    return saved;
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const prod = await this.productModel.findOne({ id });
    if (!prod) throw new Error('Product not found');

    if (data.slug !== undefined && data.slug.trim()) {
      const baseSlug = data.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
      const existing = await this.productModel.findOne({ slug: baseSlug, id: { $ne: id } }).select('_id').lean();
      prod.slug = existing ? `${baseSlug}-${Date.now().toString(36)}` : baseSlug;
    } else if (data.name !== undefined) {
      prod.name = data.name;
      const baseSlug = slugify(data.name);
      const existing = await this.productModel.findOne({ slug: baseSlug, id: { $ne: id } }).select('_id').lean();
      prod.slug = existing ? `${baseSlug}-${Date.now().toString(36)}` : baseSlug;
    }

    if (data.price !== undefined) prod.price = Number(data.price) || 0;
    if (data.originalPrice !== undefined) prod.originalPrice = Number(data.originalPrice) || 0;
    if (data.rating !== undefined) prod.rating = Number(data.rating) || 5.0;
    if (data.reviewsCount !== undefined) prod.reviewsCount = Number(data.reviewsCount) || 0;
    if (data.image !== undefined) {
      prod.image = data.image ? await this.cloudinaryService.uploadImage(data.image) : '';
    }
    if (data.images !== undefined) {
      prod.images = Array.isArray(data.images) && data.images.length > 0
        ? await Promise.all(data.images.map((img) => this.cloudinaryService.uploadImage(img)))
        : [];
    }
    if (data.category !== undefined) prod.category = data.category;
    if (data.categoryId !== undefined) prod.categoryId = data.categoryId;
    if (data.tag !== undefined) prod.tag = data.tag;
    if (data.description !== undefined) prod.description = data.description;
    if (data.colors !== undefined) prod.colors = data.colors;
    if (data.sizes !== undefined) prod.sizes = data.sizes;
    if (data.inStock !== undefined) prod.inStock = data.inStock;
    if (data.sku !== undefined) prod.sku = data.sku;
    if (data.skuMapping !== undefined) prod.skuMapping = data.skuMapping;
    if (data.isQikinkSynced !== undefined) prod.isQikinkSynced = data.isQikinkSynced;
    if (data.homeSection !== undefined) {
      const rawHomeSection = data.homeSection as any;
      prod.homeSection = Array.isArray(rawHomeSection)
        ? rawHomeSection.map((s: any) => String(s).trim()).filter(Boolean)
        : typeof rawHomeSection === 'string' && rawHomeSection.trim()
          ? [rawHomeSection.trim()]
          : [];
    }
    if (data.targetGender !== undefined) {
      prod.targetGender = data.targetGender || 'Both';
    }
    prod.updatedAt = new Date();

    const saved = await prod.save();
    this.invalidateCache();
    return saved;
  }

  async remove(id: string): Promise<void> {
    await this.productModel.deleteOne({ id });
    this.invalidateCache();
  }

  async removeAll(): Promise<{ deletedCount: number }> {
    const res = await this.productModel.deleteMany({});
    this.invalidateCache();
    return { deletedCount: res.deletedCount || 0 };
  }
}
