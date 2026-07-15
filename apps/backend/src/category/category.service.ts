import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class CategoryService implements OnModuleInit {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async onModuleInit() {
    // Disable automatic seeding as per user request to manage categories dynamically only
    // await this.seedCategories();
  }

  private async seedCategories() {
    try {
      const count = await this.categoryRepository.count();
      if (count > 0) return;

      const initial = [
        {
          name: 'T-Shirts',
          slug: 't-shirts',
          count: 18,
          image:
            'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80',
          status: 'Active',
        },
        {
          name: 'Hoodies',
          slug: 'hoodies',
          count: 12,
          image:
            'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&auto=format&fit=crop&q=80',
          status: 'Active',
        },
        {
          name: 'Accessories',
          slug: 'accessories',
          count: 8,
          image:
            'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300&auto=format&fit=crop&q=80',
          status: 'Active',
        },
        {
          name: 'Jackets',
          slug: 'jackets',
          count: 5,
          image:
            'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&auto=format&fit=crop&q=80',
          status: 'Active',
        },
        {
          name: 'Mugs',
          slug: 'mugs',
          count: 3,
          image:
            'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300&auto=format&fit=crop&q=80',
          status: 'Inactive',
        },
      ];

      const now = new Date();
      for (const item of initial) {
        const cat = new CategoryEntity();
        cat.id = randomUUID();
        cat.name = item.name;
        cat.slug = item.slug;
        cat.count = item.count;
        cat.image = item.image;
        cat.status = item.status;
        cat.createdAt = now;
        cat.updatedAt = now;
        await this.categoryRepository.save(cat);
      }
      console.log('Seeded initial categories successfully.');
    } catch (err) {
      console.error('Error seeding categories:', err);
    }
  }

  async findAll(): Promise<CategoryEntity[]> {
    return this.categoryRepository.find({ order: { createdAt: 'ASC' } });
  }

  async findOne(id: string): Promise<CategoryEntity | null> {
    return this.categoryRepository.findOne({ where: { id } });
  }

  async create(data: Partial<CategoryEntity>): Promise<CategoryEntity> {
    const now = new Date();
    const cat = new CategoryEntity();
    cat.id = randomUUID();
    cat.name = data.name!;
    cat.slug = data.slug || data.name!.toLowerCase().replace(/\s+/g, '-');
    cat.count = data.count ?? 0;
    cat.image = data.image!;
    cat.status = data.status || 'Active';
    cat.createdAt = now;
    cat.updatedAt = now;
    return this.categoryRepository.save(cat);
  }

  async update(
    id: string,
    data: Partial<CategoryEntity>,
  ): Promise<CategoryEntity> {
    const cat = await this.categoryRepository.findOne({ where: { id } });
    if (!cat) throw new Error('Category not found');

    if (data.name !== undefined) cat.name = data.name;
    if (data.slug !== undefined) cat.slug = data.slug;
    if (data.count !== undefined) cat.count = data.count;
    if (data.image !== undefined) cat.image = data.image;
    if (data.status !== undefined) cat.status = data.status;
    cat.updatedAt = new Date();

    return this.categoryRepository.save(cat);
  }

  async remove(id: string): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
