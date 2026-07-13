import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { AuthGuard } from '../user/auth.guard';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  async findActive() {
    return this.bannerService.findActive();
  }

  @UseGuards(AuthGuard)
  @Get('admin')
  async findAll() {
    return this.bannerService.findAll();
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createBannerDto: CreateBannerDto) {
    return this.bannerService.create(createBannerDto);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateBannerDto: Partial<CreateBannerDto>) {
    return this.bannerService.update(id, updateBannerDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.bannerService.delete(id);
  }
}
