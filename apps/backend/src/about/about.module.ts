import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AboutService } from './about.service';
import { AboutController } from './about.controller';
import { About, AboutSchema } from './schemas/about.schema';
import { UserModule } from '../user/user.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: About.name, schema: AboutSchema }]),
    UserModule,
    CloudinaryModule,
  ],
  providers: [AboutService],
  controllers: [AboutController],
  exports: [AboutService],
})
export class AboutModule {}
