import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from './schemas/contact.schema';
import { EmailService } from '../email/email.service';
import { randomUUID } from 'crypto';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name)
    private readonly contactModel: Model<ContactDocument>,
    private readonly emailService: EmailService,
  ) {}

  async create(data: Partial<Contact>): Promise<Contact> {
    const contact = new this.contactModel({
      id: randomUUID(),
      name: data.name!,
      email: data.email!,
      subject: data.subject || '',
      message: data.message!,
      status: 'Pending',
      createdAt: new Date(),
    });
    const saved = await contact.save();
    this.emailService
      .sendContactNotificationEmail({
        name: saved.name,
        email: saved.email,
        subject: saved.subject,
        message: saved.message,
      })
      .catch((err) => console.error('Failed to send contact notification email:', err));
    return saved;
  }

  async findAll(): Promise<Contact[]> {
    return this.contactModel.find().sort({ createdAt: -1 });
  }

  async updateStatus(id: string, status: string): Promise<Contact> {
    const contact = await this.contactModel.findOne({ id });
    if (!contact) {
      throw new NotFoundException('Contact query not found');
    }
    contact.status = status;
    return contact.save();
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const contact = await this.contactModel.findOne({ id });
    if (!contact) {
      throw new NotFoundException('Contact query not found');
    }
    await this.contactModel.deleteOne({ id });
    return { success: true };
  }
}
