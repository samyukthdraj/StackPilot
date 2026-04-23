import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import {
  AdminService,
  DashboardStats,
  UserListResponse,
  UserDetailsResponse,
  UsageStatsResponse,
  JobStatsResponse,
} from './admin.service';
import {
  AdminPaginationDto,
  UsageStatsQueryDto,
  CleanupJobsDto,
} from './dto/admin.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get overall system health and stats' })
  @ApiResponse({ status: 200, description: 'Dashboard stats retrieved' })
  getDashboard(): Promise<DashboardStats> {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'List all users with pagination' })
  @ApiResponse({ status: 200, description: 'User list retrieved' })
  getUsers(@Query() query: AdminPaginationDto): Promise<UserListResponse> {
    return this.adminService.getUsers({
      page: query.page || 1,
      limit: query.limit || 20,
    });
  }

  @Get('users/:userId')
  @ApiOperation({
    summary: 'Get detailed profile and usage for a specific user',
  })
  @ApiResponse({ status: 200, description: 'User details retrieved' })
  getUserDetails(
    @Param('userId') userId: string,
  ): Promise<UserDetailsResponse> {
    return this.adminService.getUserDetails(userId);
  }

  @Get('usage')
  @ApiOperation({ summary: 'Get system usage metrics over time' })
  @ApiResponse({ status: 200, description: 'Usage stats retrieved' })
  getUsageStats(
    @Query() query: UsageStatsQueryDto,
  ): Promise<UsageStatsResponse> {
    return this.adminService.getUsageStats({
      days: query.days || 30,
      action: query.action,
    });
  }

  @Get('jobs/stats')
  @ApiOperation({ summary: 'Get global job inventory statistics' })
  @ApiResponse({ status: 200, description: 'Job stats retrieved' })
  getJobStats(): Promise<JobStatsResponse> {
    return this.adminService.getJobStats();
  }

  @Post('jobs/sync')
  @ApiOperation({
    summary: 'Manually trigger a job sync from external providers',
  })
  @ApiResponse({ status: 200, description: 'Sync triggered' })
  forceJobSync(): Promise<{ message: string }> {
    return this.adminService.forceJobSync();
  }

  @Delete('jobs/old')
  @ApiOperation({ summary: 'Purge old jobs from the database' })
  @ApiResponse({ status: 200, description: 'Cleanup complete' })
  cleanupOldJobs(@Query() query: CleanupJobsDto): Promise<{ message: string }> {
    return this.adminService.cleanupJobs(query.days || 30);
  }
}
