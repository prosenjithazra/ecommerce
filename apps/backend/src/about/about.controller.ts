import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { AboutService } from './about.service';
import { About } from './schemas/about.schema';
import { AuthGuard } from '../user/auth.guard';

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  async getAbout(): Promise<About | null> {
    return this.aboutService.getAbout();
  }

  @UseGuards(AuthGuard)
  @Put()
  async updateAbout(@Body() data: Partial<About>): Promise<About> {
    return this.aboutService.updateAbout(data);
  }
}
