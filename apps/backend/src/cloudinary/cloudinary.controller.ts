import { Controller, Post, Body } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  async upload(@Body('image') image: string): Promise<{ url: string }> {
    const url = await this.cloudinaryService.uploadImage(image);
    return { url };
  }
}
