import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gallery, GalleryDocument } from './schemas/gallery.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { randomUUID } from 'crypto';

@Injectable()
export class GalleryService implements OnModuleInit {
  constructor(
    @InjectModel(Gallery.name)
    private readonly galleryModel: Model<GalleryDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async onModuleInit() {
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
      console.log('Gallery seeded successfully with default items.');
    }
  }

  async findActive(): Promise<Gallery[]> {
    return this.galleryModel.find({ isActive: true }).sort({ createdAt: 1 });
  }

  async findAll(): Promise<Gallery[]> {
    return this.galleryModel.find().sort({ createdAt: -1 });
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
    return item.save();
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
    return item.save();
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const item = await this.galleryModel.findOne({ id });
    if (!item) throw new NotFoundException('Gallery item not found');
    await this.galleryModel.deleteOne({ id });
    return { success: true };
  }
}
