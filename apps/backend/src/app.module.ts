import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { UserEntity } from './user/entitites/user.entity';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { CategoryEntity } from './category/entities/category.entity';
import { BannerEntity } from './banner/entities/banner.entity';
import { BannerModule } from './banner/banner.module';
import { ProductEntity } from './products/entities/product.entity';
import { OrderEntity } from './orders/entities/order.entity';
import { AboutEntity } from './about/entities/about.entity';
import { AboutModule } from './about/about.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ContactEntity } from './contact/entities/contact.entity';
import { ContactModule } from './contact/contact.module';
import { SettingsEntity } from './settings/entities/settings.entity';
import { SettingsModule } from './settings/settings.module';
import { NewsletterEntity } from './newsletter/entities/newsletter.entity';
import { NewsletterModule } from './newsletter/newsletter.module';
import { GalleryEntity } from './gallery/entities/gallery.entity';
import { GalleryModule } from './gallery/gallery.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'apps/backend/.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        if (!databaseUrl) {
          return {
            type: 'postgres',
            database: databaseUrl,
            entities: [
              UserEntity,
              BannerEntity,
              CategoryEntity,
              ProductEntity,
              OrderEntity,
              AboutEntity,
              ContactEntity,
              SettingsEntity,
              NewsletterEntity,
              GalleryEntity,
            ],
            autoLoadEntities: true,
            synchronize: true,
          };
        }

        return {
          type: 'postgres',
          url: databaseUrl,
          entities: [
            UserEntity,
            BannerEntity,
            CategoryEntity,
            ProductEntity,
            OrderEntity,
            AboutEntity,
            ContactEntity,
            SettingsEntity,
            NewsletterEntity,
            GalleryEntity,
          ],
          autoLoadEntities: true,
          synchronize: true,
          ssl:
            configService.get<string>('DATABASE_SSL') === 'false'
              ? false
              : { rejectUnauthorized: false },
        };
      },
    }),
    UserModule,
    ProductsModule,
    OrdersModule,
    CategoryModule,
    BannerModule,
    AboutModule,
    CloudinaryModule,
    ContactModule,
    SettingsModule,
    NewsletterModule,
    GalleryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
