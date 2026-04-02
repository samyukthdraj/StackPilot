import {
  Controller,
  Get,
  UseGuards,
  Query,
  Body,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserId } from '../auth/user-id.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resume } from '../resumes/entities/resume.entity';
import { JobMatch } from '../jobs/entities/job-match.entity';
import { SavedJob } from '../jobs/entities/saved-job.entity';
import { User } from './user.entity';
import { EmailService } from '../email/email.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    @InjectRepository(Resume)
    private resumeRepository: Repository<Resume>,
    @InjectRepository(JobMatch)
    private jobMatchRepository: Repository<JobMatch>,
    @InjectRepository(SavedJob)
    private savedJobRepository: Repository<SavedJob>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  @Get('dashboard-stats')
  async getDashboardStats(@UserId() userId: string) {
    // Get primary resume and its ATS score
    const primaryResume = await this.resumeRepository.findOne({
      where: { userId, isPrimary: true },
    });

    // Get total job matches
    const totalMatches = await this.jobMatchRepository.count({
      where: { userId },
    });

    // Get high-quality matches (score >= 70)
    const highQualityMatches = await this.jobMatchRepository.count({
      where: { userId },
    });

    // Get saved/applied jobs count
    const savedJobsCount = await this.savedJobRepository.count({
      where: { userId },
    });

    const appliedJobsCount = await this.savedJobRepository.count({
      where: { userId, applied: true },
    });

    return {
      resumeScore: primaryResume?.atsScore || 0,
      totalMatches: highQualityMatches,
      totalJobs: totalMatches,
      applications: appliedJobsCount,
      savedJobs: savedJobsCount,
    };
  }

  @Get('recent-activity')
  async getRecentActivity(@UserId() userId: string) {
    const activities: Array<{
      type: string;
      message: string;
      timestamp: Date;
      color: string;
    }> = [];

    // Get recent resumes
    const recentResumes = await this.resumeRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 3,
    });

    recentResumes.forEach((resume) => {
      activities.push({
        type: 'resume',
        message: `Resume "${resume.fileName}" uploaded`,
        timestamp: resume.createdAt,
        color: 'orange',
      });
    });

    // Get recent job matches
    const recentMatches = await this.jobMatchRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 3,
    });

    if (recentMatches.length > 0) {
      const latestMatch = recentMatches[0];
      activities.push({
        type: 'match',
        message: `${recentMatches.length} new job matches found`,
        timestamp: latestMatch.createdAt,
        color: 'blue',
      });
    }

    // Get recent saved jobs
    const recentSaved = await this.savedJobRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 3,
    });

    recentSaved.forEach((saved) => {
      activities.push({
        type: 'saved',
        message: saved.applied ? 'Applied to job' : 'Saved job',
        timestamp: saved.appliedAt || saved.createdAt,
        color: saved.applied ? 'purple' : 'green',
      });
    });

    // Sort by timestamp and return top 5
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 5);
  }

  @Get('activity-chart')
  async getActivityChart(@UserId() userId: string, @Query('days') days = 30) {
    const daysNum = parseInt(days.toString(), 10);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);

    // Get all resumes created in the period
    const resumes = await this.resumeRepository
      .createQueryBuilder('resume')
      .where('resume.userId = :userId', { userId })
      .andWhere('resume.createdAt >= :startDate', { startDate })
      .select('DATE(resume.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .groupBy('DATE(resume.createdAt)')
      .getRawMany();

    // Get all matches created in the period
    const matches = await this.jobMatchRepository
      .createQueryBuilder('match')
      .where('match.userId = :userId', { userId })
      .andWhere('match.createdAt >= :startDate', { startDate })
      .select('DATE(match.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .groupBy('DATE(match.createdAt)')
      .getRawMany();

    // Get all saved jobs in the period
    const saved = await this.savedJobRepository
      .createQueryBuilder('saved')
      .where('saved.userId = :userId', { userId })
      .andWhere('saved.createdAt >= :startDate', { startDate })
      .select('DATE(saved.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .groupBy('DATE(saved.createdAt)')
      .getRawMany();

    // Create a map for each day
    const activityMap = new Map<
      string,
      { scans: number; matches: number; saves: number }
    >();

    // Initialize all days with 0
    for (let i = 0; i < daysNum; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      activityMap.set(dateStr, { scans: 0, matches: 0, saves: 0 });
    }

    // Fill in resume scans
    resumes.forEach((r: { date: string; count: string }) => {
      const dateStr = new Date(r.date).toISOString().split('T')[0];
      const existing = activityMap.get(dateStr);
      if (existing) {
        existing.scans = parseInt(r.count, 10);
      }
    });

    // Fill in matches
    matches.forEach((m: { date: string; count: string }) => {
      const dateStr = new Date(m.date).toISOString().split('T')[0];
      const existing = activityMap.get(dateStr);
      if (existing) {
        existing.matches = parseInt(m.count, 10);
      }
    });

    // Fill in saves
    saved.forEach((s: { date: string; count: string }) => {
      const dateStr = new Date(s.date).toISOString().split('T')[0];
      const existing = activityMap.get(dateStr);
      if (existing) {
        existing.saves = parseInt(s.count, 10);
      }
    });

    // Convert map to array and sort by date
    return Array.from(activityMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
  @Get('notifications')
  async getNotifications(@UserId() userId: string) {
    // For now, return dynamic notifications based on existing data
    const notifications: Array<{
      id: string;
      title: string;
      message: string;
      type: 'info' | 'success' | 'warning' | 'error';
      timestamp: Date;
      read: boolean;
    }> = [];

    // Check for high ATS score resumes
    const highAtsResumes = await this.resumeRepository.find({
      where: { userId },
      order: { atsScore: 'DESC' },
      take: 2,
    });

    highAtsResumes.forEach((resume) => {
      if (resume.atsScore && resume.atsScore >= 80) {
        notifications.push({
          id: `ats-${resume.id}`,
          title: 'High ATS Score!',
          message: `Your resume "${resume.fileName}" has a great score of ${resume.atsScore}%.`,
          type: 'success',
          timestamp: resume.updatedAt,
          read: false,
        });
      }
    });

    // Check for recently found matches
    const latestMatches = await this.jobMatchRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 5,
    });

    if (latestMatches.length > 0) {
      notifications.push({
        id: 'matches-new',
        title: 'New Matches Found',
        message: `We found ${latestMatches.length} new jobs that match your profile.`,
        type: 'info',
        timestamp: latestMatches[0].createdAt,
        read: false,
      });
    }

    return notifications.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
    );
  }

  @Get('profile/notification-settings')
  async getNotificationSettings(@UserId() userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['notificationPreferences'],
    });

    return (
      user?.notificationPreferences || {
        email: {
          dailyDigest: true,
          newMatches: true,
          applicationReminders: true,
          marketing: false,
        },
        push: {
          newMatches: true,
          applicationUpdates: true,
        },
      }
    );
  }

  @Post('profile/notification-settings')
  async updateNotificationSettings(
    @UserId() userId: string,
    @Body() preferences: Record<string, any>,
  ) {
    await this.userRepository.update(userId, {
      notificationPreferences: preferences,
    });
    return { success: true };
  }

  @Post('profile/update-name')
  async updateName(@UserId() userId: string, @Body('name') name: string) {
    await this.userRepository.update(userId, { name });
    return { success: true, name };
  }

  @Post('profile/test-email')
  async testEmail(@UserId() userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');

    try {
      await this.emailService.sendWelcomeEmail(user.email, user.name || 'User');
      return { success: true };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Email test failed: ${errorMessage}`);
    }
  }
}
