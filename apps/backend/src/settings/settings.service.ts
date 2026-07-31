import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Settings, SettingsDocument } from './schemas/settings.schema';

const CACHE_KEY_GLOBAL_SETTINGS = 'cache_global_settings';

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(
    @InjectModel(Settings.name)
    private readonly settingsModel: Model<SettingsDocument>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async onModuleInit() {
    setImmediate(() => {
      this.seedSettings().catch(() => {});
    });
  }

  async seedSettings() {
    try {
      const exists = await this.settingsModel.findOne({ id: 'global' }).select('_id').lean();
      if (!exists) {
        const settings = new this.settingsModel({
          id: 'global',
          email: 'support@kliamofashion.com',
          phone: '+1 555-0199',
          address: '123 Creative St, New York, NY 10001',
          hours: 'Mon - Fri, 9am - 6pm EST',
          twitterUrl: 'https://twitter.com/kliamo',
          youtubeUrl: 'https://youtube.com/@kliamo',
          instagramUrl: 'https://instagram.com/kliamo',
          facebookUrl: 'https://facebook.com/kliamo',
          customTshirtPrice: 599,
          customPoloPrice: 799,
          customShirtPrice: 999,
          updatedAt: new Date(),
        });
        await settings.save();
      }
    } catch (err) {}
  }

  async get(): Promise<Settings> {
    const cached = await this.cacheManager.get<Settings>(CACHE_KEY_GLOBAL_SETTINGS);
    if (cached) return cached;

    const settings = await this.settingsModel.findOne({ id: 'global' }).lean();
    const result = settings || ({
      id: 'global',
      email: 'support@kliamofashion.com',
      phone: '+1 555-0199',
      address: '123 Creative St, New York, NY 10001',
      hours: 'Mon - Fri, 9am - 6pm EST',
      twitterUrl: 'https://twitter.com/kliamo',
      youtubeUrl: 'https://youtube.com/@kliamo',
      instagramUrl: 'https://instagram.com/kliamo',
      facebookUrl: 'https://facebook.com/kliamo',
      customTshirtPrice: 599,
      customPoloPrice: 799,
      customShirtPrice: 999,
      updatedAt: new Date(),
    } as Settings);

    await this.cacheManager.set(CACHE_KEY_GLOBAL_SETTINGS, result, 600000);
    return result;
  }

  async update(data: Partial<Settings>): Promise<Settings> {
    let settings = await this.settingsModel.findOne({ id: 'global' });
    if (!settings) {
      settings = new this.settingsModel({ id: 'global' });
    }
    if (data.email !== undefined) settings.email = data.email;
    if (data.phone !== undefined) settings.phone = data.phone;
    if (data.address !== undefined) settings.address = data.address;
    if (data.hours !== undefined) settings.hours = data.hours;
    if (data.twitterUrl !== undefined) settings.twitterUrl = data.twitterUrl;
    if (data.youtubeUrl !== undefined) settings.youtubeUrl = data.youtubeUrl;
    if (data.instagramUrl !== undefined) settings.instagramUrl = data.instagramUrl;
    if (data.facebookUrl !== undefined) settings.facebookUrl = data.facebookUrl;
    if (data.customTshirtPrice !== undefined) settings.customTshirtPrice = Number(data.customTshirtPrice);
    if (data.customPoloPrice !== undefined) settings.customPoloPrice = Number(data.customPoloPrice);
    if (data.customShirtPrice !== undefined) settings.customShirtPrice = Number(data.customShirtPrice);
    settings.updatedAt = new Date();

    const saved = await settings.save();
    try {
      await this.cacheManager.del(CACHE_KEY_GLOBAL_SETTINGS);
    } catch (err) {}
    return saved;
  }
}
