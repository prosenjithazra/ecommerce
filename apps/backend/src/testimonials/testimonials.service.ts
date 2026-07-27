import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Testimonial, TestimonialDocument } from './schemas/testimonial.schema';
import { randomUUID } from 'crypto';

@Injectable()
export class TestimonialsService implements OnModuleInit {
  constructor(
    @InjectModel(Testimonial.name)
    private readonly testimonialModel: Model<TestimonialDocument>,
  ) {}

  async onModuleInit() {
    const count = await this.testimonialModel.countDocuments();
    if (count === 0) {
      const defaults = [
        {
          id: randomUUID(),
          name: 'Alex Mercer',
          avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Alex',
          rating: 5,
          comment: 'Print quality exceeded expectations! Vibrant colors and super soft fabric.',
          productName: 'Custom T-Shirt',
          userCount: 1240,
          isActive: true,
        },
        {
          id: randomUUID(),
          name: 'Sarah Jenkins',
          avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Sarah',
          rating: 5,
          comment: 'Intuitive designer and incredibly fast delivery. Outstanding service!',
          productName: 'Custom Polo',
          userCount: 980,
          isActive: true,
        },
        {
          id: randomUUID(),
          name: 'Marcus Thorne',
          avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Marcus',
          rating: 4,
          comment: 'Great material, lovely fit. The canvas text editor is really fun to use.',
          productName: 'Custom Shirt',
          userCount: 760,
          isActive: true,
        },
      ];
      await this.testimonialModel.insertMany(defaults);
      console.log('[TestimonialsService] Seeded default testimonials.');
    }
  }

  async findActive(): Promise<Testimonial[]> {
    return this.testimonialModel.find({ isActive: true }).sort({ createdAt: -1 });
  }

  async findAll(): Promise<Testimonial[]> {
    return this.testimonialModel.find().sort({ createdAt: -1 });
  }

  async create(data: Partial<Testimonial>): Promise<Testimonial> {
    const item = new this.testimonialModel({
      id: randomUUID(),
      name: data.name || 'Anonymous',
      avatar: data.avatar || '',
      rating: Math.min(5, Math.max(1, Number(data.rating) || 5)),
      comment: data.comment || '',
      productName: data.productName || '',
      userCount: 0, // always starts at 0 — not admin-settable
      isActive: data.isActive ?? true,
    });
    return item.save();
  }

  async update(id: string, data: Partial<Testimonial>): Promise<Testimonial> {
    const item = await this.testimonialModel.findOne({ id });
    if (!item) throw new NotFoundException('Testimonial not found');
    if (data.name !== undefined) item.name = data.name;
    if (data.avatar !== undefined) item.avatar = data.avatar;
    if (data.rating !== undefined) item.rating = Math.min(5, Math.max(1, Number(data.rating)));
    if (data.comment !== undefined) item.comment = data.comment;
    if (data.productName !== undefined) item.productName = data.productName;
    if (data.isActive !== undefined) item.isActive = data.isActive;
    // userCount is intentionally NOT updated from admin input
    return item.save();
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const item = await this.testimonialModel.findOne({ id });
    if (!item) throw new NotFoundException('Testimonial not found');
    await this.testimonialModel.deleteOne({ id });
    return { success: true };
  }
}
