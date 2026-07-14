import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsletterEntity } from './entities/newsletter.entity';
import { NewsletterController } from './newsletter.controller';
import { NewsletterService } from './newsletter.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([NewsletterEntity]), UserModule],
  controllers: [NewsletterController],
  providers: [NewsletterService],
  exports: [NewsletterService],
})
export class NewsletterModule {}
