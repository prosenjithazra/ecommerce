import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { AboutService } from './about.service';
import { AboutEntity } from './entities/about.entity';
import { AuthGuard } from '../user/auth.guard';

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  async getAbout(): Promise<AboutEntity | null> {
    return this.aboutService.getAbout();
  }

  @UseGuards(AuthGuard)
  @Put()
  async updateAbout(@Body() data: Partial<AboutEntity>): Promise<AboutEntity> {
    return this.aboutService.updateAbout(data);
  }
}
