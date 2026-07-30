import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { Policy, PolicySectionItem } from './schemas/policy.schema';

@Controller('policies')
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @Get()
  async getAll(): Promise<Policy[]> {
    return this.policiesService.findAll();
  }

  @Get(':type')
  async getByType(@Param('type') type: string): Promise<Policy> {
    return this.policiesService.findByType(type);
  }

  @Put(':type')
  async update(
    @Param('type') type: string,
    @Body() body: { title?: string; subtitle?: string; sections: PolicySectionItem[] },
  ): Promise<Policy> {
    return this.policiesService.updatePolicy(type, body);
  }
}
