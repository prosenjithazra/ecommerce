import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { randomUUID } from 'crypto';

const slugify = (name: string): string =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async onModuleInit() {
    // Ensure every existing product in MongoDB has a non-empty slug
    try {
      const products = await this.productModel.find();
      for (const p of products) {
        if (!p.slug || p.slug.trim() === '') {
          const baseSlug = slugify(p.name || 'product');
          const calculatedSlug = `${baseSlug}-${p.id.slice(0, 6)}`;
          await this.productModel.updateOne(
            { _id: p._id },
            { $set: { slug: calculatedSlug } },
          );
        }
      }
    } catch (err) {
      console.error('Failed to auto-migrate product slugs:', err);
    }
  }

  async findAll(): Promise<Product[]> {
    const products = await this.productModel.find().sort({ createdAt: -1 });
    // Ensure every returned product object has a valid slug
    for (const p of products) {
      if (!p.slug || p.slug.trim() === '') {
        p.slug = slugify(p.name || 'product');
      }
    }
    return products;
  }

  async findOne(id: string): Promise<Product | null> {
    let prod = await this.productModel.findOne({ id });
    if (!prod) {
      prod = await this.productModel.findOne({ slug: id });
    }
    if (prod && (!prod.slug || prod.slug.trim() === '')) {
      prod.slug = slugify(prod.name || 'product');
    }
    return prod;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    // 1. Match by exact slug
    let prod = await this.productModel.findOne({ slug });
    if (prod) return prod;

    // 2. Fallback: match by product ID
    prod = await this.productModel.findOne({ id: slug });
    if (prod) {
      if (!prod.slug || prod.slug.trim() === '') {
        prod.slug = slugify(prod.name || 'product');
        await prod.save();
      }
      return prod;
    }

    // 3. Fallback: match by slugifying name of any existing product
    const all = await this.productModel.find();
    for (const p of all) {
      if (slugify(p.name || '') === slug) {
        p.slug = slug;
        await p.save();
        return p;
      }
    }

    return null;
  }

  async create(data: Partial<Product>): Promise<Product> {
    const now = new Date();
    const name = data.name || 'Custom Product';
    const baseSlug = slugify(name);
    let slug = baseSlug;
    const existing = await this.productModel.findOne({ slug });
    if (existing) slug = `${baseSlug}-${Date.now().toString(36)}`;

    const prod = new this.productModel({
      id: randomUUID(),
      name,
      slug,
      price: Number(data.price) || 0,
      originalPrice: Number(data.originalPrice) || 0,
      rating: Number(data.rating) || 5.0,
      reviewsCount: Number(data.reviewsCount) || 0,
      image: data.image || '',
      images: data.images || [],
      category: data.category || 'T-Shirts',
      tag: data.tag || '',
      description: data.description || '',
      colors: data.colors || [],
      sizes: data.sizes || [],
      inStock: data.inStock ?? true,
      sku: data.sku || 'SKU-' + Date.now(),
      skuMapping: data.skuMapping || {},
      isQikinkSynced: data.isQikinkSynced ?? true,
      createdAt: now,
      updatedAt: now,
    });
    return prod.save();
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const prod = await this.productModel.findOne({ id });
    if (!prod) throw new Error('Product not found');

    if (data.slug !== undefined && data.slug.trim()) {
      const baseSlug = data.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
      const existing = await this.productModel.findOne({ slug: baseSlug, id: { $ne: id } });
      prod.slug = existing ? `${baseSlug}-${Date.now().toString(36)}` : baseSlug;
    } else if (data.name !== undefined) {
      prod.name = data.name;
      const baseSlug = slugify(data.name);
      const existing = await this.productModel.findOne({ slug: baseSlug, id: { $ne: id } });
      prod.slug = existing ? `${baseSlug}-${Date.now().toString(36)}` : baseSlug;
    }
    if (data.price !== undefined) prod.price = Number(data.price) || 0;
    if (data.originalPrice !== undefined) prod.originalPrice = Number(data.originalPrice) || 0;
    if (data.rating !== undefined) prod.rating = Number(data.rating) || 5.0;
    if (data.reviewsCount !== undefined) prod.reviewsCount = Number(data.reviewsCount) || 0;
    if (data.image !== undefined) prod.image = data.image;
    if (data.images !== undefined) prod.images = data.images;
    if (data.category !== undefined) prod.category = data.category;
    if (data.tag !== undefined) prod.tag = data.tag;
    if (data.description !== undefined) prod.description = data.description;
    if (data.colors !== undefined) prod.colors = data.colors;
    if (data.sizes !== undefined) prod.sizes = data.sizes;
    if (data.inStock !== undefined) prod.inStock = data.inStock;
    if (data.sku !== undefined) prod.sku = data.sku;
    if (data.skuMapping !== undefined) prod.skuMapping = data.skuMapping;
    if (data.isQikinkSynced !== undefined) prod.isQikinkSynced = data.isQikinkSynced;
    prod.updatedAt = new Date();

    return prod.save();
  }

  async remove(id: string): Promise<void> {
    await this.productModel.deleteOne({ id });
  }

  async removeAll(): Promise<{ deletedCount: number }> {
    const res = await this.productModel.deleteMany({});
    return { deletedCount: res.deletedCount || 0 };
  }
}
