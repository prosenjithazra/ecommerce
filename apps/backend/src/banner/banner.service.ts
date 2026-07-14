import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BannerEntity } from './entities/banner.entity';
import { CreateBannerDto } from './dto/create-banner.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { randomUUID } from 'crypto';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(BannerEntity)
    private readonly bannerRepository: Repository<BannerEntity>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findActive(): Promise<BannerEntity[]> {
    return this.bannerRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(): Promise<BannerEntity[]> {
    return this.bannerRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async create(dto: CreateBannerDto): Promise<BannerEntity> {
    const banner = new BannerEntity();
    const now = new Date();

    banner.id = randomUUID();
    banner.badge = dto.badge || '';
    banner.headline1 = dto.headline1;
    banner.headline2 = dto.headline2;
    banner.headline2Color = dto.headline2Color || '#F9A37E';
    banner.sub = dto.sub || '';

    if (dto.productImg) {
      banner.productImg = await this.cloudinaryService.uploadImage(
        dto.productImg,
      );
    } else {
      banner.productImg = '';
    }

    if (dto.bgImg) {
      banner.bgImg = await this.cloudinaryService.uploadImage(dto.bgImg);
    } else {
      banner.bgImg = '';
    }

    banner.headline1Color = dto.headline1Color || '';
    banner.subColor = dto.subColor || '';
    banner.badgeColor = dto.badgeColor || '';
    banner.overlayColor = dto.overlayColor || '#000000';

    banner.bg = dto.bg || '#E8E2D6';
    banner.accent = dto.accent || '#F9A37E';
    banner.textDark = dto.textDark ?? true;
    banner.isActive = dto.isActive ?? true;
    banner.badges = dto.badges || null;
    banner.createdAt = now;
    banner.updatedAt = now;

    return this.bannerRepository.save(banner);
  }

  async update(
    id: string,
    dto: Partial<CreateBannerDto>,
  ): Promise<BannerEntity> {
    const banner = await this.bannerRepository.findOne({ where: { id } });
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
      banner.productImg = await this.cloudinaryService.uploadImage(
        dto.productImg,
      );
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
    return this.bannerRepository.save(banner);
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const res = await this.bannerRepository.delete(id);
    if (res.affected === 0) {
      throw new NotFoundException('Banner slide not found');
    }
    return { success: true };
  }
}
