import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { AdminService } from './admin.service';

// Define simple return types inline
type DashboardStats = {
  users: { total: number; activeToday: number };
  jobs: { total: number; addedToday: number };
  usage: { totalScans: number; totalMatches: number };
  timestamp: Date;
};

type UserListResponse = {
  users: Array<{
    id: string;
    email: string;
    subscriptionType: string;
    dailyResumeScans: number;
    createdAt: Date;
  }>;
  total: number;
  page: number;
  totalPages: number;
};

type UserDetailsResponse = {
  user: {
    id: string;
    email: string;
    subscriptionType: string;
    createdAt: Date;
    resumes: number;
  };
  usage: Array<{
    id: string;
    action: string;
    createdAt: Date;
    metadata?: any;
  }>;
};

type UsageStatsResponse = Array<{ date: string; count: number }>;

type JobStatsResponse = {
  total: number;
  byCountry: Record<string, number>;
  recent: { count: number; days: number };
};

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getDashboard(): Promise<DashboardStats> {
    return this.adminService.getDashboardStats() as Promise<DashboardStats>;
  }

  @Get('users')
  getUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<UserListResponse> {
    return this.adminService.getUsers({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    }) as Promise<UserListResponse>;
  }

  @Get('users/:userId')
  getUserDetails(
    @Param('userId') userId: string,
  ): Promise<UserDetailsResponse> {
    return this.adminService.getUserDetails(
      userId,
    ) as Promise<UserDetailsResponse>;
  }

  @Get('usage')
  getUsageStats(
    @Query('days') days?: string,
    @Query('action') action?: string,
  ): Promise<UsageStatsResponse> {
    return this.adminService.getUsageStats({
      days: days ? parseInt(days, 10) : 30,
      action,
    }) as Promise<UsageStatsResponse>;
  }

  @Get('jobs/stats')
  getJobStats(): Promise<JobStatsResponse> {
    return this.adminService.getJobStats() as Promise<JobStatsResponse>;
  }

  @Post('jobs/sync')
  forceJobSync(): Promise<{ message: string }> {
    return this.adminService.forceJobSync() as Promise<{ message: string }>;
  }

  @Delete('jobs/old')
  cleanupOldJobs(@Query('days') days?: string): Promise<{ message: string }> {
    return this.adminService.cleanupJobs(
      days ? parseInt(days, 10) : 30,
    ) as Promise<{ message: string }>;
  }
}
