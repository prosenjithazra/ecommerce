import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Settings, SettingsDocument } from './schemas/settings.schema';

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(
    @InjectModel(Settings.name)
    private readonly settingsModel: Model<SettingsDocument>,
  ) {}

  async onModuleInit() {
    await this.seedSettings();
  }

  async seedSettings() {
    try {
      const exists = await this.settingsModel.findOne({ id: 'global' });
      if (!exists) {
        const settings = new this.settingsModel({
          id: 'global',
          email: 'support@kliamofashion.com',
          phone: '+1 555-0199',
          address: '123 Creative St, New York, NY 10001',
          hours: 'Mon - Fri, 9am - 6pm EST',
          twitterUrl: 'https://twitter.com/kliamo',
          instagramUrl: 'https://instagram.com/kliamo',
          facebookUrl: 'https://facebook.com/kliamo',
          customTshirtPrice: 599,
          customPoloPrice: 799,
          customShirtPrice: 999,
          updatedAt: new Date(),
        });
        await settings.save();
        console.log('Seeded default global company settings successfully.');
      }
    } catch (err) {
      console.error('Error seeding global company settings:', err);
    }
  }

  async get(): Promise<Settings> {
    const settings = await this.settingsModel.findOne({ id: 'global' });
    if (!settings) {
      return {
        id: 'global',
        email: 'support@kliamofashion.com',
        phone: '+1 555-0199',
        address: '123 Creative St, New York, NY 10001',
        hours: 'Mon - Fri, 9am - 6pm EST',
        twitterUrl: 'https://twitter.com/kliamo',
        instagramUrl: 'https://instagram.com/kliamo',
        facebookUrl: 'https://facebook.com/kliamo',
        customTshirtPrice: 599,
        customPoloPrice: 799,
        customShirtPrice: 999,
        updatedAt: new Date(),
      } as Settings;
    }
    return settings;
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
    if (data.instagramUrl !== undefined)
      settings.instagramUrl = data.instagramUrl;
    if (data.facebookUrl !== undefined) settings.facebookUrl = data.facebookUrl;
    if (data.customTshirtPrice !== undefined)
      settings.customTshirtPrice = Number(data.customTshirtPrice);
    if (data.customPoloPrice !== undefined)
      settings.customPoloPrice = Number(data.customPoloPrice);
    if (data.customShirtPrice !== undefined)
      settings.customShirtPrice = Number(data.customShirtPrice);
    settings.updatedAt = new Date();

    return settings.save();
  }
}
