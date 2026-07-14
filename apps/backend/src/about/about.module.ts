import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AboutService } from './about.service';
import { AboutController } from './about.controller';
import { AboutEntity } from './entities/about.entity';
import { UserModule } from '../user/user.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AboutEntity]),
    UserModule,
    CloudinaryModule,
  ],
  providers: [AboutService],
  controllers: [AboutController],
  exports: [AboutService],
})
export class AboutModule {}
