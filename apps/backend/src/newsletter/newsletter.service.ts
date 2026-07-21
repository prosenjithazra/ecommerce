import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Newsletter, NewsletterDocument } from './schemas/newsletter.schema';
import { randomUUID } from 'crypto';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectModel(Newsletter.name)
    private readonly newsletterModel: Model<NewsletterDocument>,
  ) {}

  async subscribe(email: string): Promise<Newsletter> {
    const existing = await this.newsletterModel.findOne({ email });
    if (existing) {
      if (existing.status === 'Unsubscribed') {
        existing.status = 'Active';
        existing.subscribedAt = new Date();
        return existing.save();
      }
      throw new ConflictException('This email is already subscribed.');
    }
    const subscriber = new this.newsletterModel({
      id: randomUUID(),
      email,
      status: 'Active',
      subscribedAt: new Date(),
    });
    return subscriber.save();
  }

  async findAll(): Promise<Newsletter[]> {
    return this.newsletterModel.find().sort({ subscribedAt: -1 });
  }

  async updateStatus(id: string, status: string): Promise<Newsletter> {
    const subscriber = await this.newsletterModel.findOne({ id });
    if (!subscriber) throw new NotFoundException('Subscriber not found.');
    subscriber.status = status;
    return subscriber.save();
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const subscriber = await this.newsletterModel.findOne({ id });
    if (!subscriber) throw new NotFoundException('Subscriber not found.');
    await this.newsletterModel.deleteOne({ id });
    return { success: true };
  }
}
