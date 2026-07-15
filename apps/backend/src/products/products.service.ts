import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async onModuleInit() {
    // Disable automatic seeding as per user request to manage products dynamically only
    // await this.seedProducts();
  }

  private async seedProducts() {
    try {
      const count = await this.productRepository.count();
      if (count > 0) return;

      const initial = [
        {
          name: 'Premium Soft Cotton Tee',
          price: 2549,
          originalPrice: 3399,
          rating: 4.8,
          reviewsCount: 124,
          image:
            'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
          images: [
            'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
          ],
          category: 'T-Shirts',
          tag: 'Best Seller',
          description:
            'Ultra-soft combed cotton t-shirt — perfect base for premium custom prints.',
          colors: [
            { name: 'White', hex: '#ffffff' },
            { name: 'Black', hex: '#0f172a' },
          ],
          sizes: ['S', 'M', 'L', 'XL'],
          inStock: true,
          sku: 'PHT-001',
        },
        {
          name: 'Heavyweight Fleece Hoodie',
          price: 4249,
          originalPrice: 5099,
          rating: 4.9,
          reviewsCount: 88,
          image:
            'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80',
          images: [
            'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80',
          ],
          category: 'Hoodies',
          tag: 'New',
          description:
            'Heavy fleece hoodie with comfortable boxy fit and double-stitched kangaroo pocket.',
          colors: [
            { name: 'Black', hex: '#0f172a' },
            { name: 'Sand', hex: '#e2e8f0' },
          ],
          sizes: ['M', 'L', 'XL'],
          inStock: true,
          sku: 'PHH-002',
        },
        {
          name: 'Classic Organic Crewneck',
          price: 2999,
          originalPrice: 3999,
          rating: 4.7,
          reviewsCount: 52,
          image:
            'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=800&auto=format&fit=crop&q=80',
          images: [
            'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=800&auto=format&fit=crop&q=80',
          ],
          category: 'Sweatshirts',
          tag: 'Eco',
          description:
            '100% certified organic cotton crewneck with cozy brushed interior.',
          colors: [{ name: 'Heather Grey', hex: '#94a3b8' }],
          sizes: ['S', 'M', 'L', 'XL'],
          inStock: true,
          sku: 'PHC-003',
        },
        {
          name: 'Premium Canvas Tote Bag',
          price: 1699,
          originalPrice: 2199,
          rating: 4.6,
          reviewsCount: 31,
          image:
            'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
          images: [
            'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
          ],
          category: 'Accessories',
          tag: 'Essential',
          description:
            'Heavy canvas material with reinforced straps. Perfect blank canvas for your design.',
          colors: [{ name: 'Natural', hex: '#f8fafc' }],
          sizes: ['One Size'],
          inStock: true,
          sku: 'PHA-004',
        },
      ];

      const now = new Date();
      for (const item of initial) {
        const prod = new ProductEntity();
        prod.id = randomUUID();
        prod.name = item.name;
        prod.price = item.price;
        prod.originalPrice = item.originalPrice;
        prod.rating = item.rating;
        prod.reviewsCount = item.reviewsCount;
        prod.image = item.image;
        prod.images = item.images;
        prod.category = item.category;
        prod.tag = item.tag;
        prod.description = item.description;
        prod.colors = item.colors;
        prod.sizes = item.sizes;
        prod.inStock = item.inStock;
        prod.sku = item.sku;
        prod.createdAt = now;
        prod.updatedAt = now;
        await this.productRepository.save(prod);
      }
      console.log('Seeded initial products successfully.');
    } catch (err) {
      console.error('Error seeding products:', err);
    }
  }

  async findAll(): Promise<ProductEntity[]> {
    return this.productRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<ProductEntity | null> {
    return this.productRepository.findOne({ where: { id } });
  }

  async create(data: Partial<ProductEntity>): Promise<ProductEntity> {
    const now = new Date();
    const prod = new ProductEntity();
    prod.id = randomUUID();
    prod.name = data.name!;
    prod.price = Number(data.price) || 0;
    prod.originalPrice = Number(data.originalPrice) || 0;
    prod.rating = Number(data.rating) || 5.0;
    prod.reviewsCount = Number(data.reviewsCount) || 0;
    prod.image = data.image || '';
    prod.images = data.images || [];
    prod.category = data.category || 'T-Shirts';
    prod.tag = data.tag || '';
    prod.description = data.description || '';
    prod.colors = data.colors || [];
    prod.sizes = data.sizes || [];
    prod.inStock = data.inStock ?? true;
    prod.sku = data.sku || 'SKU-' + Date.now();
    prod.createdAt = now;
    prod.updatedAt = now;
    return this.productRepository.save(prod);
  }

  async update(
    id: string,
    data: Partial<ProductEntity>,
  ): Promise<ProductEntity> {
    const prod = await this.productRepository.findOne({ where: { id } });
    if (!prod) throw new Error('Product not found');

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

    return this.productRepository.save(prod);
  }

  async remove(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }
}
