import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { AuthGuard } from '../user/auth.guard';
import { GalleryEntity } from './entities/gallery.entity';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  async findActive() {
    return this.galleryService.findActive();
  }

  @UseGuards(AuthGuard)
  @Get('admin')
  async findAll() {
    return this.galleryService.findAll();
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() data: Partial<GalleryEntity>) {
    return this.galleryService.create(data);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<GalleryEntity>,
  ) {
    return this.galleryService.update(id, data);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.galleryService.delete(id);
  }
}
