import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { Contact } from './schemas/contact.schema';
import { AuthGuard } from '../user/auth.guard';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async create(@Body() data: Partial<Contact>): Promise<Contact> {
    return this.contactService.create(data);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(): Promise<Contact[]> {
    return this.contactService.findAll();
  }

  @UseGuards(AuthGuard)
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ): Promise<Contact> {
    return this.contactService.updateStatus(id, status);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.contactService.delete(id);
  }
}
