import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GalleryEntity } from './entities/gallery.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class GalleryService implements OnModuleInit {
  constructor(
    @InjectRepository(GalleryEntity)
    private readonly galleryRepository: Repository<GalleryEntity>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async onModuleInit() {
    const count = await this.galleryRepository.count();
    if (count === 0) {
      const defaults = [
        {
          mediaUrl: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&auto=format&fit=crop&q=80",
          link: "https://www.instagram.com/p/DF123456789/",
          mediaType: "image",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          mediaUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=80",
          link: "https://www.instagram.com/p/DF234567890/",
          mediaType: "image",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          mediaUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&auto=format&fit=crop&q=80",
          link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          mediaType: "video",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          mediaUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=80",
          link: "https://www.instagram.com/p/DF345678901/",
          mediaType: "image",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      await this.galleryRepository.save(
        defaults.map((d) => this.galleryRepository.create(d)),
      );
      console.log('Gallery seeded successfully with default items.');
    }
  }

  async findActive(): Promise<GalleryEntity[]> {
    return this.galleryRepository.find({
      where: { isActive: true },
      order: { createdAt: 'ASC' },
    });
  }

  async findAll(): Promise<GalleryEntity[]> {
    return this.galleryRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async create(data: Partial<GalleryEntity>): Promise<GalleryEntity> {
    if (data.mediaUrl) {
      data.mediaUrl = await this.cloudinaryService.uploadImage(data.mediaUrl);
    }
    const item = this.galleryRepository.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.galleryRepository.save(item);
  }

  async update(id: string, data: Partial<GalleryEntity>): Promise<GalleryEntity> {
    const item = await this.galleryRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Gallery item not found');
    if (data.mediaUrl !== undefined) {
      data.mediaUrl = data.mediaUrl ? await this.cloudinaryService.uploadImage(data.mediaUrl) : '';
    }
    Object.assign(item, data);
    item.updatedAt = new Date();
    return this.galleryRepository.save(item);
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const item = await this.galleryRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Gallery item not found');
    await this.galleryRepository.delete(id);
    return { success: true };
  }
}
