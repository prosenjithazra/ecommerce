import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { BannerModule } from './banner/banner.module';
import { AboutModule } from './about/about.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ContactModule } from './contact/contact.module';
import { SettingsModule } from './settings/settings.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { GalleryModule } from './gallery/gallery.module';
import { EmailModule } from './email/email.module';
import { CartModule } from './cart/cart.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { CouponsModule } from './coupons/coupons.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/backend/.env', '.env'],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mongoUrl =
          configService.get<string>('MONGODB_URI') ||
          configService.get<string>('MONGDB_URI') ||
          configService.get<string>('DATABASE_URL');

        console.log('[AppModule] Connecting to MongoDB URL:', mongoUrl?.replace(/:([^@]+)@/, ':****@'));

        return {
          uri: mongoUrl,
          serverSelectionTimeoutMS: 10000,
          connectTimeoutMS: 10000,
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
    EmailModule,
    CartModule,
    WishlistModule,
    CouponsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
