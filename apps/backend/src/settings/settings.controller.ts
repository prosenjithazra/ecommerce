import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Settings } from './schemas/settings.schema';
import { AuthGuard } from '../user/auth.guard';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async get(): Promise<Settings> {
    return this.settingsService.get();
  }

  @UseGuards(AuthGuard)
  @Put()
  async update(@Body() data: Partial<Settings>): Promise<Settings> {
    return this.settingsService.update(data);
  }
}
