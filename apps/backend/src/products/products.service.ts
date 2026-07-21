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


const SEED_PRODUCTS = [
  {
    id: 'p1',
    name: 'Premium Soft Cotton Tee',
    slug: 'premium-soft-cotton-tee',
    price: 2549,
    originalPrice: 3399,
    category: 'T-Shirts',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80'],
    inStock: true,
    tag: 'Best Seller',
    sku: 'PHT-001',
    description: 'Tailored with a modern fit and crafted from ultra-soft combed cotton. Perfect for daily casual wear or custom printing.',
    colors: [{ name: 'White', hex: '#ffffff' }, { name: 'Black', hex: '#0f172a' }],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 5.0,
    reviewsCount: 18,
  },
  {
    id: 'p2',
    name: 'Heavyweight Fleece Hoodie',
    slug: 'heavyweight-fleece-hoodie',
    price: 4249,
    originalPrice: 5099,
    category: 'Hoodies',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=80'],
    inStock: true,
    tag: 'New',
    sku: 'PHH-002',
    description: 'Stay warm in style with this premium heavyweight fleece hoodie. Double-lined hood and durable kangaroo pocket.',
    colors: [{ name: 'Black', hex: '#0f172a' }, { name: 'Forest Green', hex: '#14532d' }],
    sizes: ['M', 'L', 'XL', 'XXL'],
    rating: 4.8,
    reviewsCount: 12,
  },
  {
    id: 'p3',
    name: 'Embroidery Custom Canvas Cap',
    slug: 'embroidery-custom-canvas-cap',
    price: 1699,
    originalPrice: 2199,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&auto=format&fit=crop&q=80'],
    inStock: true,
    tag: '',
    sku: 'PHA-003',
    description: 'Structure 6-panel canvas cap ideal for high-definition custom embroidery. Adjustable strap at back.',
    colors: [{ name: 'Navy Blue', hex: '#1e3a8a' }, { name: 'Black', hex: '#0f172a' }],
    sizes: ['M', 'L'],
    rating: 4.6,
    reviewsCount: 8,
  },
  {
    id: 'p4',
    name: 'Zip-Up Lightweight Bomber',
    slug: 'zip-up-lightweight-bomber',
    price: 5499,
    originalPrice: 6999,
    category: 'Jackets',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=80'],
    inStock: true,
    tag: 'Sale',
    sku: 'PHJ-004',
    description: 'Sleek lightweight bomber jacket with metallic zipper closure and ribbed collar cuffs. Wind-resistant shell.',
    colors: [{ name: 'Black', hex: '#0f172a' }, { name: 'Heather Grey', hex: '#94a3b8' }],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.9,
    reviewsCount: 24,
  },
  {
    id: 'p5',
    name: 'Classic Logo Mug 350ml',
    slug: 'classic-logo-mug-350ml',
    price: 799,
    originalPrice: 999,
    category: 'Mugs',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&auto=format&fit=crop&q=80'],
    inStock: true,
    tag: '',
    sku: 'PHM-005',
    description: 'Dishwasher and microwave safe ceramic mug. Glossy finish with vibrant sublimation print surface.',
    colors: [{ name: 'White', hex: '#ffffff' }],
    sizes: ['M'],
    rating: 4.7,
    reviewsCount: 15,
  },
];

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async onModuleInit() {
    // 1. Seed missing default products p1-p5 with try-catch per item
    for (const item of SEED_PRODUCTS) {
      try {
        const exists = await this.productModel.findOne({
          $or: [{ id: item.id }, { sku: item.sku }, { slug: item.slug }],
        });
        if (!exists) {
          await this.productModel.create({
            ...item,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        } else if (!exists.slug || exists.slug.trim() === '') {
          await this.productModel.updateOne(
            { _id: exists._id },
            { $set: { slug: item.slug } },
          );
        }
      } catch (e) {
        // Ignore duplicate key errors on seed
      }
    }

    // 2. Ensure every single product in MongoDB has a non-empty slug
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
    const name = data.name!;
    const baseSlug = slugify(name);
    // ensure slug is unique by appending a short suffix if needed
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
      createdAt: now,
      updatedAt: now,
    });
    return prod.save();
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const prod = await this.productModel.findOne({ id });
    if (!prod) throw new Error('Product not found');

    if (data.slug !== undefined && data.slug.trim()) {
      // Admin passed a custom slug — validate uniqueness
      const baseSlug = data.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
      const existing = await this.productModel.findOne({ slug: baseSlug, id: { $ne: id } });
      prod.slug = existing ? `${baseSlug}-${Date.now().toString(36)}` : baseSlug;
    } else if (data.name !== undefined) {
      prod.name = data.name;
      // Regenerate slug from new name
      const baseSlug = slugify(data.name);
      const existing = await this.productModel.findOne({ slug: baseSlug, id: { $ne: id } });
      prod.slug = existing ? `${baseSlug}-${Date.now().toString(36)}` : baseSlug;
    }
    if (data.name !== undefined && !data.slug) prod.name = data.name;
    if (data.name !== undefined) prod.name = data.name;
    if (data.price !== undefined) prod.price = Number(data.price) || 0;
    if (data.originalPrice !== undefined)
      prod.originalPrice = Number(data.originalPrice) || 0;
    if (data.rating !== undefined) prod.rating = Number(data.rating) || 5.0;
    if (data.reviewsCount !== undefined)
      prod.reviewsCount = Number(data.reviewsCount) || 0;
    if (data.image !== undefined) prod.image = data.image;
    if (data.images !== undefined) prod.images = data.images;
    if (data.category !== undefined) prod.category = data.category;
    if (data.tag !== undefined) prod.tag = data.tag;
    if (data.description !== undefined) prod.description = data.description;
    if (data.colors !== undefined) prod.colors = data.colors;
    if (data.sizes !== undefined) prod.sizes = data.sizes;
    if (data.inStock !== undefined) prod.inStock = data.inStock;
    if (data.sku !== undefined) prod.sku = data.sku;
    prod.updatedAt = new Date();

    return prod.save();
  }

  async remove(id: string): Promise<void> {
    await this.productModel.deleteOne({ id });
  }
}
