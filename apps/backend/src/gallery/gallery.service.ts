import { Injectable, OnModuleInit, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Gallery, GalleryDocument } from './schemas/gallery.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { randomUUID } from 'crypto';

const CACHE_KEY_ACTIVE_GALLERY = 'cache_active_gallery';
const CACHE_KEY_ALL_GALLERY = 'cache_all_gallery';

@Injectable()
export class GalleryService implements OnModuleInit {
  constructor(
    @InjectModel(Gallery.name)
    private readonly galleryModel: Model<GalleryDocument>,
    private readonly cloudinaryService: CloudinaryService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async onModuleInit() {
    setImmediate(async () => {
      try {
        const count = await this.galleryModel.countDocuments();
        if (count === 0) {
          const defaults = [
            {
              id: randomUUID(),
              mediaUrl: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&auto=format&fit=crop&q=80",
              link: "https://www.instagram.com/p/DF123456789/",
              mediaType: "image",
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: randomUUID(),
              mediaUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=80",
              link: "https://www.instagram.com/p/DF234567890/",
              mediaType: "image",
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: randomUUID(),
              mediaUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&auto=format&fit=crop&q=80",
              link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              mediaType: "video",
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: randomUUID(),
              mediaUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=80",
              link: "https://www.instagram.com/p/DF345678901/",
              mediaType: "image",
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ];
          await this.galleryModel.insertMany(defaults);
        }
      } catch (err) {}
    });
  }

  private async invalidateCache() {
    try {
      await Promise.all([
        this.cacheManager.del(CACHE_KEY_ACTIVE_GALLERY),
        this.cacheManager.del(CACHE_KEY_ALL_GALLERY),
      ]);
    } catch (err) {}
  }

  async findActive(): Promise<Gallery[]> {
    const cached = await this.cacheManager.get<Gallery[]>(CACHE_KEY_ACTIVE_GALLERY);
    if (cached) return cached;

    const items = await this.galleryModel
      .find({ isActive: true })
      .sort({ createdAt: 1 })
      .lean();

    await this.cacheManager.set(CACHE_KEY_ACTIVE_GALLERY, items, 300000);
    return items;
  }

  async findAll(): Promise<Gallery[]> {
    const cached = await this.cacheManager.get<Gallery[]>(CACHE_KEY_ALL_GALLERY);
    if (cached) return cached;

    const items = await this.galleryModel.find().sort({ createdAt: -1 }).lean();
    await this.cacheManager.set(CACHE_KEY_ALL_GALLERY, items, 300000);
    return items;
  }

  async create(data: Partial<Gallery>): Promise<Gallery> {
    let mediaUrl = data.mediaUrl || '';
    if (mediaUrl) {
      mediaUrl = await this.cloudinaryService.uploadImage(mediaUrl);
    }
    const item = new this.galleryModel({
      id: randomUUID(),
      mediaUrl,
      link: data.link || '',
      mediaType: data.mediaType || 'image',
      isActive: data.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const saved = await item.save();
    this.invalidateCache();
    return saved;
  }

  async update(id: string, data: Partial<Gallery>): Promise<Gallery> {
    const item = await this.galleryModel.findOne({ id });
    if (!item) throw new NotFoundException('Gallery item not found');
    if (data.mediaUrl !== undefined) {
      item.mediaUrl = data.mediaUrl ? await this.cloudinaryService.uploadImage(data.mediaUrl) : '';
    }
    if (data.link !== undefined) item.link = data.link;
    if (data.mediaType !== undefined) item.mediaType = data.mediaType;
    if (data.isActive !== undefined) item.isActive = data.isActive;
    item.updatedAt = new Date();

    const saved = await item.save();
    this.invalidateCache();
    return saved;
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const item = await this.galleryModel.findOne({ id });
    if (!item) throw new NotFoundException('Gallery item not found');
    await this.galleryModel.deleteOne({ id });
    this.invalidateCache();
    return { success: true };
  }
}
