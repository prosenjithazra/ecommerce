import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { GalleryEntity } from './entities/gallery.entity';
import { UserModule } from '../user/user.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GalleryEntity]),
    UserModule,
    CloudinaryModule,
  ],
  controllers: [GalleryController],
  providers: [GalleryService],
  exports: [GalleryService],
})
export class GalleryModule {}
