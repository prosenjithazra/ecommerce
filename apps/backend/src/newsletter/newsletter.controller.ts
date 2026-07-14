import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { AuthGuard } from '../user/auth.guard';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('subscribe')
  @HttpCode(HttpStatus.CREATED)
  async subscribe(@Body('email') email: string) {
    return this.newsletterService.subscribe(email);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return this.newsletterService.findAll();
  }

  @UseGuards(AuthGuard)
  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.newsletterService.updateStatus(id, status);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.newsletterService.delete(id);
  }
}
