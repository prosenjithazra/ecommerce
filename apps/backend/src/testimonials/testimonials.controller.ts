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
import { TestimonialsService } from './testimonials.service';
import { AuthGuard } from '../user/auth.guard';
import { Testimonial } from './schemas/testimonial.schema';

@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  /** Public — returns only active testimonials */
  @Get()
  async findActive() {
    return this.testimonialsService.findActive();
  }

  /** Admin — returns all testimonials */
  @UseGuards(AuthGuard)
  @Get('admin')
  async findAll() {
    return this.testimonialsService.findAll();
  }

  /** Admin — create new testimonial */
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() data: Partial<Testimonial>) {
    return this.testimonialsService.create(data);
  }

  /** Admin — update testimonial by id (PUT) */
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Testimonial>,
  ) {
    return this.testimonialsService.update(id, data);
  }

  /** Admin — delete testimonial */
  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.testimonialsService.delete(id);
  }
}
