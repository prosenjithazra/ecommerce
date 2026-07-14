import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsEntity } from './entities/settings.entity';
import { AuthGuard } from '../user/auth.guard';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async get(): Promise<SettingsEntity> {
    return this.settingsService.get();
  }

  @UseGuards(AuthGuard)
  @Put()
  async update(@Body() data: Partial<SettingsEntity>): Promise<SettingsEntity> {
    return this.settingsService.update(data);
  }
}
