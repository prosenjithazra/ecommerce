/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
import { BannerEntity } from './banner/entities/banner.entity';
import { BannerModule } from './banner/banner.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

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
            entities: [UserEntity, BannerEntity],
            autoLoadEntities: true,
            synchronize: true,
          };
        }

        return {
          type: 'postgres',
          url: databaseUrl,
          entities: [UserEntity, BannerEntity],
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
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
