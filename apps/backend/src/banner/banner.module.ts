import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerEntity } from './entities/banner.entity';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([BannerEntity]), CloudinaryModule],
  controllers: [BannerController],
  providers: [BannerService],
  exports: [BannerService],
})
export class BannerModule {}
