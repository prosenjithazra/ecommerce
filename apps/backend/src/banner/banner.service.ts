import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Banner, BannerDocument } from './schemas/banner.schema';
import { CreateBannerDto } from './dto/create-banner.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { randomUUID } from 'crypto';

const CACHE_KEY_ACTIVE_BANNERS = 'cache_active_banners';
const CACHE_KEY_ALL_BANNERS = 'cache_all_banners';

@Injectable()
export class BannerService {
  constructor(
    @InjectModel(Banner.name)
    private readonly bannerModel: Model<BannerDocument>,
    private readonly cloudinaryService: CloudinaryService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  private async invalidateCache() {
    try {
      await Promise.all([
        this.cacheManager.del(CACHE_KEY_ACTIVE_BANNERS),
        this.cacheManager.del(CACHE_KEY_ALL_BANNERS),
      ]);
    } catch (err) {}
  }

  async findActive(): Promise<Banner[]> {
    const cached = await this.cacheManager.get<Banner[]>(CACHE_KEY_ACTIVE_BANNERS);
    if (cached) return cached;

    const banners = await this.bannerModel
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();

    await this.cacheManager.set(CACHE_KEY_ACTIVE_BANNERS, banners, 300000);
    return banners;
  }

  async findAll(): Promise<Banner[]> {
    const cached = await this.cacheManager.get<Banner[]>(CACHE_KEY_ALL_BANNERS);
    if (cached) return cached;

    const banners = await this.bannerModel.find().sort({ createdAt: -1 }).lean();
    await this.cacheManager.set(CACHE_KEY_ALL_BANNERS, banners, 300000);
    return banners;
  }

  async create(dto: CreateBannerDto): Promise<Banner> {
    const now = new Date();
    
    // Parallel Cloudinary image uploads
    const [desktopImage, mobileImage, productImg, bgImg] = await Promise.all([
      dto.desktopImage ? this.cloudinaryService.uploadImage(dto.desktopImage) : Promise.resolve(''),
      dto.mobileImage ? this.cloudinaryService.uploadImage(dto.mobileImage) : Promise.resolve(''),
      dto.productImg ? this.cloudinaryService.uploadImage(dto.productImg) : Promise.resolve(''),
      dto.bgImg ? this.cloudinaryService.uploadImage(dto.bgImg) : Promise.resolve(''),
    ]);

    const banner = new this.bannerModel({
      id: randomUUID(),
      title: dto.title || '',
      desktopImage,
      mobileImage,
      link: dto.link || '',
      badge: dto.badge || '',
      headline1: dto.headline1 || '',
      headline2: dto.headline2 || '',
      headline2Color: dto.headline2Color || '#df794d',
      sub: dto.sub || '',
      productImg,
      bgImg,
      headline1Color: dto.headline1Color || '',
      subColor: dto.subColor || '',
      badgeColor: dto.badgeColor || '',
      overlayColor: dto.overlayColor || '#000000',
      bg: dto.bg || '#E8E2D6',
      accent: dto.accent || '#df794d',
      textDark: dto.textDark ?? true,
      isActive: dto.isActive ?? true,
      badges: dto.badges || [],
      createdAt: now,
      updatedAt: now,
    });

    const saved = await banner.save();
    this.invalidateCache();
    return saved;
  }

  async update(id: string, dto: Partial<CreateBannerDto>): Promise<Banner> {
    const banner = await this.bannerModel.findOne({ id });
    if (!banner) {
      throw new NotFoundException('Banner slide not found');
    }

    if (dto.title !== undefined) banner.title = dto.title;
    if (dto.link !== undefined) banner.link = dto.link;

    // Parallel Cloudinary uploads if updated
    const uploadTasks: Promise<void>[] = [];

    if (dto.desktopImage !== undefined) {
      uploadTasks.push(
        (async () => {
          banner.desktopImage = dto.desktopImage ? await this.cloudinaryService.uploadImage(dto.desktopImage) : '';
        })()
      );
    }
    if (dto.mobileImage !== undefined) {
      uploadTasks.push(
        (async () => {
          banner.mobileImage = dto.mobileImage ? await this.cloudinaryService.uploadImage(dto.mobileImage) : '';
        })()
      );
    }
    if (dto.productImg !== undefined) {
      uploadTasks.push(
        (async () => {
          banner.productImg = dto.productImg ? await this.cloudinaryService.uploadImage(dto.productImg) : '';
        })()
      );
    }
    if (dto.bgImg !== undefined) {
      uploadTasks.push(
        (async () => {
          banner.bgImg = dto.bgImg ? await this.cloudinaryService.uploadImage(dto.bgImg) : '';
        })()
      );
    }

    if (uploadTasks.length > 0) {
      await Promise.all(uploadTasks);
    }

    if (dto.badge !== undefined) banner.badge = dto.badge;
    if (dto.headline1 !== undefined) banner.headline1 = dto.headline1;
    if (dto.headline2 !== undefined) banner.headline2 = dto.headline2;
    if (dto.headline2Color !== undefined) banner.headline2Color = dto.headline2Color;
    if (dto.sub !== undefined) banner.sub = dto.sub;
    if (dto.headline1Color !== undefined) banner.headline1Color = dto.headline1Color;
    if (dto.subColor !== undefined) banner.subColor = dto.subColor;
    if (dto.badgeColor !== undefined) banner.badgeColor = dto.badgeColor;
    if (dto.overlayColor !== undefined) banner.overlayColor = dto.overlayColor;
    if (dto.bg !== undefined) banner.bg = dto.bg;
    if (dto.accent !== undefined) banner.accent = dto.accent;
    if (dto.textDark !== undefined) banner.textDark = dto.textDark;
    if (dto.isActive !== undefined) banner.isActive = dto.isActive;
    if (dto.badges !== undefined) banner.badges = dto.badges;

    banner.updatedAt = new Date();
    const saved = await banner.save();
    this.invalidateCache();
    return saved;
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const res = await this.bannerModel.deleteOne({ id });
    if (res.deletedCount === 0) {
      throw new NotFoundException('Banner slide not found');
    }
    this.invalidateCache();
    return { success: true };
  }
}
