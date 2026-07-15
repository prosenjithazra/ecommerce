import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SettingsEntity } from './entities/settings.entity';

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(
    @InjectRepository(SettingsEntity)
    private readonly settingsRepository: Repository<SettingsEntity>,
  ) {}

  async onModuleInit() {
    await this.seedSettings();
  }

  async seedSettings() {
    try {
      const exists = await this.settingsRepository.findOne({
        where: { id: 'global' },
      });
      if (!exists) {
        const settings = this.settingsRepository.create({
          id: 'global',
          email: 'support@kaivafashion.com',
          phone: '+1 555-0199',
          address: '123 Creative St, New York, NY 10001',
          hours: 'Mon - Fri, 9am - 6pm EST',
          twitterUrl: 'https://twitter.com/kaiva',
          instagramUrl: 'https://instagram.com/kaiva',
          facebookUrl: 'https://facebook.com/kaiva',
          customTshirtPrice: 599,
          customPoloPrice: 799,
          customShirtPrice: 999,
          updatedAt: new Date(),
        });
        await this.settingsRepository.save(settings);
        console.log('Seeded default global company settings successfully.');
      }
    } catch (err) {
      console.error('Error seeding global company settings:', err);
    }
  }

  async get(): Promise<SettingsEntity> {
    const settings = await this.settingsRepository.findOne({
      where: { id: 'global' },
    });
    if (!settings) {
      // Return temporary defaults in memory in case of transient DB delay
      return {
        id: 'global',
        email: 'support@kaivafashion.com',
        phone: '+1 555-0199',
        address: '123 Creative St, New York, NY 10001',
        hours: 'Mon - Fri, 9am - 6pm EST',
        twitterUrl: 'https://twitter.com/kaiva',
        instagramUrl: 'https://instagram.com/kaiva',
        facebookUrl: 'https://facebook.com/kaiva',
        customTshirtPrice: 599,
        customPoloPrice: 799,
        customShirtPrice: 999,
        updatedAt: new Date(),
      };
    }
    return settings;
  }

  async update(data: Partial<SettingsEntity>): Promise<SettingsEntity> {
    let settings = await this.settingsRepository.findOne({
      where: { id: 'global' },
    });
    if (!settings) {
      settings = this.settingsRepository.create({ id: 'global' });
    }
    if (data.email !== undefined) settings.email = data.email;
    if (data.phone !== undefined) settings.phone = data.phone;
    if (data.address !== undefined) settings.address = data.address;
    if (data.hours !== undefined) settings.hours = data.hours;
    if (data.twitterUrl !== undefined) settings.twitterUrl = data.twitterUrl;
    if (data.instagramUrl !== undefined)
      settings.instagramUrl = data.instagramUrl;
    if (data.facebookUrl !== undefined) settings.facebookUrl = data.facebookUrl;
    if (data.customTshirtPrice !== undefined) settings.customTshirtPrice = Number(data.customTshirtPrice);
    if (data.customPoloPrice !== undefined) settings.customPoloPrice = Number(data.customPoloPrice);
    if (data.customShirtPrice !== undefined) settings.customShirtPrice = Number(data.customShirtPrice);
    settings.updatedAt = new Date();
    return this.settingsRepository.save(settings);
  }
}
