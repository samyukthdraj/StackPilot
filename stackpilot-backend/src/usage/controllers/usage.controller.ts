import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UserId } from '../../auth/user-id.decorator';
import { UsageService } from '../services/usage.service';

@Controller('usage')
@UseGuards(JwtAuthGuard)
export class UsageController {
  constructor(private readonly usageService: UsageService) {}

  @Get('summary')
  async getUsageSummary(@UserId() userId: string) {
    return this.usageService.getUsageSummary(userId);
  }
}
