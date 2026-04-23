import { Controller, Get, UseGuards, Query, Body, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserId } from '../auth/user-id.decorator';
import { UsersService } from './users.service';
import {
  UpdateNameDto,
  UpdateNotificationSettingsDto,
  ActivityChartDto,
} from './dto/users.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('dashboard-stats')
  @ApiOperation({ summary: 'Get user dashboard overview statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getDashboardStats(@UserId() userId: string) {
    return this.usersService.getDashboardStats(userId);
  }

  @Get('recent-activity')
  @ApiOperation({ summary: 'Get list of recent user activities' })
  @ApiResponse({
    status: 200,
    description: 'Activities retrieved successfully',
  })
  async getRecentActivity(@UserId() userId: string) {
    return this.usersService.getRecentActivity(userId);
  }

  @Get('activity-chart')
  @ApiOperation({ summary: 'Get data for the user activity chart over time' })
  @ApiResponse({
    status: 200,
    description: 'Chart data retrieved successfully',
  })
  async getActivityChart(
    @UserId() userId: string,
    @Query() query: ActivityChartDto,
  ) {
    return this.usersService.getActivityChart(userId, query.days || 30);
  }

  @Get('notifications')
  @ApiOperation({ summary: 'Get list of unread notifications for the user' })
  @ApiResponse({
    status: 200,
    description: 'Notifications retrieved successfully',
  })
  async getNotifications(@UserId() userId: string) {
    return this.usersService.getNotifications(userId);
  }

  @Get('profile/notification-settings')
  @ApiOperation({
    summary: 'Get user notification preferences',
  })
  @ApiResponse({
    status: 200,
    description: 'Settings retrieved successfully',
  })
  async getNotificationSettings(@UserId() userId: string) {
    return await this.usersService.getNotificationSettings(userId);
  }

  @Post('profile/notification-settings')
  @ApiOperation({ summary: 'Update user notification preferences' })
  @ApiResponse({ status: 200, description: 'Settings updated successfully' })
  async updateNotificationSettings(
    @UserId() userId: string,
    @Body() dto: UpdateNotificationSettingsDto,
  ) {
    await this.usersService.updateNotificationSettings(userId, dto.preferences);
    return { success: true };
  }

  @Post('profile/update-name')
  @ApiOperation({ summary: 'Update user display name' })
  @ApiResponse({ status: 200, description: 'Name updated successfully' })
  async updateName(@UserId() userId: string, @Body() dto: UpdateNameDto) {
    await this.usersService.updateName(userId, dto.name);
    return { success: true, name: dto.name };
  }

  @Post('profile/test-email')
  @ApiOperation({ summary: 'Send a test welcome email to the current user' })
  @ApiResponse({ status: 200, description: 'Test email sent successfully' })
  async testEmail(@UserId() userId: string) {
    await this.usersService.testEmail(userId);
    return { success: true };
  }
}
