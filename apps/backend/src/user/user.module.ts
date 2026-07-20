import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entitites/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), CloudinaryModule, EmailModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
