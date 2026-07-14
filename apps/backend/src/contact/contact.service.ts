import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactEntity } from './entities/contact.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactEntity)
    private readonly contactRepository: Repository<ContactEntity>,
  ) {}

  async create(data: Partial<ContactEntity>): Promise<ContactEntity> {
    const contact = this.contactRepository.create({
      ...data,
      status: 'Pending',
      createdAt: new Date(),
    });
    return this.contactRepository.save(contact);
  }

  async findAll(): Promise<ContactEntity[]> {
    return this.contactRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, status: string): Promise<ContactEntity> {
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException('Contact query not found');
    }
    contact.status = status;
    return this.contactRepository.save(contact);
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException('Contact query not found');
    }
    await this.contactRepository.delete(id);
    return { success: true };
  }
}
