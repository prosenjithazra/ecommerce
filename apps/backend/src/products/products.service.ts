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

  async findByCategory(categoryOrId: string): Promise<Product[]> {
    const slugifiedQuery = slugify(categoryOrId);
    const all = await this.productModel.find().sort({ createdAt: -1 });
    return all.filter((p) => {
      if (p.categoryId && p.categoryId === categoryOrId) return true;
      if (p.category && p.category.toLowerCase() === categoryOrId.toLowerCase()) return true;
      if (p.category && slugify(p.category) === slugifiedQuery) return true;
      return false;
    });
  }

  async filterProducts(filters: {
    homeSection?: string;
    targetGender?: string;
    category?: string;
    categoryId?: string;
  }): Promise<Product[]> {
    const all = await this.productModel.find().sort({ createdAt: -1 });
    return all.filter((p) => {
      if (filters.categoryId && p.categoryId !== filters.categoryId) return false;
      if (filters.category) {
        const catQuery = filters.category.trim().toLowerCase();
        const slugifiedQuery = slugify(filters.category);
        const matchCat =
          (p.category && p.category.toLowerCase() === catQuery) ||
          (p.category && slugify(p.category) === slugifiedQuery) ||
          (p.categoryId && p.categoryId === filters.category);
        if (!matchCat) return false;
      }

      if (filters.homeSection) {
        const secQuery = filters.homeSection.trim().toLowerCase();
        const rawSections = p.homeSection as any;
        const sections: string[] = Array.isArray(rawSections)
          ? rawSections.map((s) => String(s).trim())
          : typeof rawSections === 'string' && rawSections.trim()
            ? [rawSections.trim()]
            : [];
        const matchesSection =
          sections.some((s) => s.toLowerCase() === secQuery) ||
          (p.tag && p.tag.trim().toLowerCase() === secQuery);
        if (!matchesSection) return false;
      }

      if (filters.targetGender) {
        const genQuery = filters.targetGender.trim().toLowerCase();
        const g = (p.targetGender || 'Both').trim().toLowerCase();
        if (genQuery === 'men') {
          if (g !== 'men' && g !== 'both') return false;
        } else if (genQuery === 'women') {
          if (g !== 'women' && g !== 'both') return false;
        } else if (genQuery !== 'both') {
          if (g !== genQuery) return false;
        }
      }

      return true;
    });
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
    const existing = await this.productModel.findOne({ slug });
    if (existing) slug = `${baseSlug}-${Date.now().toString(36)}`;

    const rawHomeSection = data.homeSection as any;
    const homeSection: string[] = Array.isArray(rawHomeSection)
      ? rawHomeSection.map((s: any) => String(s).trim()).filter(Boolean)
      : typeof rawHomeSection === 'string' && rawHomeSection.trim()
        ? [rawHomeSection.trim()]
        : [];

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
      categoryId: data.categoryId || '',
      tag: data.tag || '',
      description: data.description || '',
      colors: data.colors || [],
      sizes: data.sizes || [],
      inStock: data.inStock ?? true,
      sku: data.sku || 'SKU-' + Date.now(),
      skuMapping: data.skuMapping || {},
      isQikinkSynced: data.isQikinkSynced ?? true,
      homeSection,
      targetGender: data.targetGender || 'Both',
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
