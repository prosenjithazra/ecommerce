import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner, BannerDocument } from './schemas/banner.schema';
import { CreateBannerDto } from './dto/create-banner.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { randomUUID } from 'crypto';

@Injectable()
export class BannerService {
  constructor(
    @InjectModel(Banner.name)
    private readonly bannerModel: Model<BannerDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findActive(): Promise<Banner[]> {
    return this.bannerModel
      .find({ isActive: true })
      .sort({ createdAt: -1 });
  }

  async findAll(): Promise<Banner[]> {
    return this.bannerModel.find().sort({ createdAt: -1 });
  }

  async create(dto: CreateBannerDto): Promise<Banner> {
    const now = new Date();
    const productImg = dto.productImg
      ? await this.cloudinaryService.uploadImage(dto.productImg)
      : '';
    const bgImg = dto.bgImg
      ? await this.cloudinaryService.uploadImage(dto.bgImg)
      : '';

    const banner = new this.bannerModel({
      id: randomUUID(),
      badge: dto.badge || '',
      headline1: dto.headline1 || '',
      headline2: dto.headline2 || '',
      headline2Color: dto.headline2Color || '#F9A37E',
      sub: dto.sub || '',
      productImg,
      bgImg,
      headline1Color: dto.headline1Color || '',
      subColor: dto.subColor || '',
      badgeColor: dto.badgeColor || '',
      overlayColor: dto.overlayColor || '#000000',
      bg: dto.bg || '#E8E2D6',
      accent: dto.accent || '#F9A37E',
      textDark: dto.textDark ?? true,
      isActive: dto.isActive ?? true,
      badges: dto.badges || [],
      createdAt: now,
      updatedAt: now,
    });

    return banner.save();
  }

  async update(id: string, dto: Partial<CreateBannerDto>): Promise<Banner> {
    const banner = await this.bannerModel.findOne({ id });
    if (!banner) {
      throw new NotFoundException('Banner slide not found');
    }

    if (dto.badge !== undefined) banner.badge = dto.badge;
    if (dto.headline1 !== undefined) banner.headline1 = dto.headline1;
    if (dto.headline2 !== undefined) banner.headline2 = dto.headline2;
    if (dto.headline2Color !== undefined)
      banner.headline2Color = dto.headline2Color;
    if (dto.sub !== undefined) banner.sub = dto.sub;

    if (dto.productImg !== undefined) {
      banner.productImg = dto.productImg
        ? await this.cloudinaryService.uploadImage(dto.productImg)
        : '';
    }

    if (dto.bgImg !== undefined) {
      banner.bgImg = dto.bgImg
        ? await this.cloudinaryService.uploadImage(dto.bgImg)
        : '';
    }

    if (dto.headline1Color !== undefined)
      banner.headline1Color = dto.headline1Color;
    if (dto.subColor !== undefined) banner.subColor = dto.subColor;
    if (dto.badgeColor !== undefined) banner.badgeColor = dto.badgeColor;
    if (dto.overlayColor !== undefined) banner.overlayColor = dto.overlayColor;

    if (dto.bg !== undefined) banner.bg = dto.bg;
    if (dto.accent !== undefined) banner.accent = dto.accent;
    if (dto.textDark !== undefined) banner.textDark = dto.textDark;
    if (dto.isActive !== undefined) banner.isActive = dto.isActive;
    if (dto.badges !== undefined) banner.badges = dto.badges;

    banner.updatedAt = new Date();
    return banner.save();
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const res = await this.bannerModel.deleteOne({ id });
    if (res.deletedCount === 0) {
      throw new NotFoundException('Banner slide not found');
    }
    return { success: true };
  }
}
