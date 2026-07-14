import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsletterEntity } from './entities/newsletter.entity';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectRepository(NewsletterEntity)
    private readonly newsletterRepository: Repository<NewsletterEntity>,
  ) {}

  async subscribe(email: string): Promise<NewsletterEntity> {
    const existing = await this.newsletterRepository.findOne({
      where: { email },
    });
    if (existing) {
      if (existing.status === 'Unsubscribed') {
        existing.status = 'Active';
        existing.subscribedAt = new Date();
        return this.newsletterRepository.save(existing);
      }
      throw new ConflictException('This email is already subscribed.');
    }
    const subscriber = this.newsletterRepository.create({
      email,
      status: 'Active',
      subscribedAt: new Date(),
    });
    return this.newsletterRepository.save(subscriber);
  }

  async findAll(): Promise<NewsletterEntity[]> {
    return this.newsletterRepository.find({
      order: { subscribedAt: 'DESC' },
    });
  }

  async updateStatus(id: string, status: string): Promise<NewsletterEntity> {
    const subscriber = await this.newsletterRepository.findOne({
      where: { id },
    });
    if (!subscriber) throw new NotFoundException('Subscriber not found.');
    subscriber.status = status;
    return this.newsletterRepository.save(subscriber);
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const subscriber = await this.newsletterRepository.findOne({
      where: { id },
    });
    if (!subscriber) throw new NotFoundException('Subscriber not found.');
    await this.newsletterRepository.delete(id);
    return { success: true };
  }
}
