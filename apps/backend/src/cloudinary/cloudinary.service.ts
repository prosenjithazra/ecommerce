import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private readonly configService: ConfigService) {
    let cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    let apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    let apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    const cloudinaryUrl = this.configService.get<string>('CLOUDINARY_URL');
    if (cloudinaryUrl && (!cloudName || !apiKey || !apiSecret)) {
      try {
        const urlStr = cloudinaryUrl.replace('cloudinary://', '');
        const [credentials, cloud] = urlStr.split('@');
        const [key, secret] = credentials.split(':');
        cloudName = cloud;
        apiKey = key;
        apiSecret = secret;
      } catch (err) {
        this.logger.error('Failed to parse CLOUDINARY_URL', err);
      }
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    this.logger.log(`Initialized Cloudinary with Cloud Name: ${cloudName}`);
  }

  async uploadImage(base64Str: string): Promise<string> {
    if (!base64Str) return '';
    
    // If it's already an uploaded HTTP link, return it as-is
    if (base64Str.startsWith('http://') || base64Str.startsWith('https://')) {
      return base64Str;
    }

    try {
      this.logger.log('Uploading image to Cloudinary...');
      const uploadResponse = await cloudinary.uploader.upload(base64Str, {
        folder: 'my-turborepo-ecommerce',
      });
      this.logger.log(`Successfully uploaded image: ${uploadResponse.secure_url}`);
      return uploadResponse.secure_url;
    } catch (error: any) {
      this.logger.error(`Cloudinary upload failed: ${error.message || error}`);
      // Return the base64 string as fallback to avoid breaking the application
      return base64Str;
    }
  }
}
