import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Resume } from '../resumes/entities/resume.entity';
import { JobMatch } from '../jobs/entities/job-match.entity';
import { SavedJob } from '../jobs/entities/saved-job.entity';
import { EmailService } from '../email/email.service';
import { NotificationPreferences } from './dto/users.dto';

export interface ActivityItem {
  type: string;
  message: string;
  timestamp: Date;
  color: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Resume)
    private readonly resumeRepository: Repository<Resume>,
    @InjectRepository(JobMatch)
    private readonly jobMatchRepository: Repository<JobMatch>,
    @InjectRepository(SavedJob)
    private readonly savedJobRepository: Repository<SavedJob>,
    private readonly emailService: EmailService,
  ) {}

  async getDashboardStats(userId: string) {
    const [
      primaryResume,
      totalMatches,
      highQualityMatches,
      savedJobsCount,
      appliedJobsCount,
    ] = await Promise.all([
      this.resumeRepository.findOne({ where: { userId, isPrimary: true } }),
      this.jobMatchRepository.count({ where: { userId } }),
      this.jobMatchRepository.count({ where: { userId } }), // Re-evaluating score if needed
      this.savedJobRepository.count({ where: { userId } }),
      this.savedJobRepository.count({ where: { userId, applied: true } }),
    ]);

    return {
      resumeScore: primaryResume?.atsScore || 0,
      totalMatches: highQualityMatches,
      totalJobs: totalMatches,
      applications: appliedJobsCount,
      savedJobs: savedJobsCount,
    };
  }

  async getRecentActivity(userId: string): Promise<ActivityItem[]> {
    const [resumes, matches, saved] = await Promise.all([
      this.resumeRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
        take: 3,
      }),
      this.jobMatchRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
        take: 3,
      }),
      this.savedJobRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
        take: 3,
      }),
    ]);

    const activities: ActivityItem[] = [];

    resumes.forEach((resume) => {
      activities.push({
        type: 'resume',
        message: `Resume "${resume.fileName}" uploaded`,
        timestamp: resume.createdAt,
        color: 'orange',
      });
    });

    if (matches.length > 0) {
      activities.push({
        type: 'match',
        message: `${matches.length} new job matches found`,
        timestamp: matches[0].createdAt,
        color: 'blue',
      });
    }

    saved.forEach((item) => {
      activities.push({
        type: 'saved',
        message: item.applied ? 'Applied to job' : 'Saved job',
        timestamp: item.appliedAt || item.createdAt,
        color: item.applied ? 'purple' : 'green',
      });
    });

    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 5);
  }

  async getActivityChart(userId: string, days: number) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [resumes, matches, saved] = await Promise.all([
      this.resumeRepository
        .createQueryBuilder('resume')
        .where('resume.userId = :userId', { userId })
        .andWhere('resume.createdAt >= :startDate', { startDate })
        .select('DATE(resume.createdAt)', 'date')
        .addSelect('COUNT(*)', 'count')
        .groupBy('DATE(resume.createdAt)')
        .getRawMany(),
      this.jobMatchRepository
        .createQueryBuilder('match')
        .where('match.userId = :userId', { userId })
        .andWhere('match.createdAt >= :startDate', { startDate })
        .select('DATE(match.createdAt)', 'date')
        .addSelect('COUNT(*)', 'count')
        .groupBy('DATE(match.createdAt)')
        .getRawMany(),
      this.savedJobRepository
        .createQueryBuilder('saved')
        .where('saved.userId = :userId', { userId })
        .andWhere('saved.createdAt >= :startDate', { startDate })
        .select('DATE(saved.createdAt)', 'date')
        .addSelect('COUNT(*)', 'count')
        .groupBy('DATE(saved.createdAt)')
        .getRawMany(),
    ]);

    const activityMap = new Map<
      string,
      { scans: number; matches: number; saves: number }
    >();

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      activityMap.set(dateStr, { scans: 0, matches: 0, saves: 0 });
    }

    resumes.forEach((r: { date: string; count: string }) => {
      const dateStr = new Date(r.date).toISOString().split('T')[0];
      const entry = activityMap.get(dateStr);
      if (entry) {
        entry.scans = parseInt(r.count, 10);
      }
    });

    matches.forEach((m: { date: string; count: string }) => {
      const dateStr = new Date(m.date).toISOString().split('T')[0];
      const entry = activityMap.get(dateStr);
      if (entry) {
        entry.matches = parseInt(m.count, 10);
      }
    });

    saved.forEach((s: { date: string; count: string }) => {
      const dateStr = new Date(s.date).toISOString().split('T')[0];
      const entry = activityMap.get(dateStr);
      if (entry) {
        entry.saves = parseInt(s.count, 10);
      }
    });

    return Array.from(activityMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async getNotifications(userId: string): Promise<NotificationItem[]> {
    const [highAtsResumes, latestMatches] = await Promise.all([
      this.resumeRepository.find({
        where: { userId },
        order: { atsScore: 'DESC' },
        take: 2,
      }),
      this.jobMatchRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
        take: 5,
      }),
    ]);

    const notifications: NotificationItem[] = [];

    highAtsResumes.forEach((resume) => {
      if (resume.atsScore && resume.atsScore >= 80) {
        notifications.push({
          id: `ats-${resume.id}`,
          title: 'High ATS Score!',
          message: `Your resume "${resume.fileName}" has a score of ${resume.atsScore}%.`,
          type: 'success',
          timestamp: resume.updatedAt,
          read: false,
        });
      }
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

  async getNotificationSettings(userId: string) {
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

  async updateNotificationSettings(
    userId: string,
    preferences: NotificationPreferences,
  ) {
    await this.userRepository.update(userId, {
      notificationPreferences: preferences,
    });
  }

  async updateName(userId: string, name: string) {
    await this.userRepository.update(userId, { name });
  }

  async findOne(userId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async updateLastJobMatchEmailSentAt(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      lastJobMatchEmailSentAt: new Date(),
    });
  }

  async testEmail(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');
    await this.emailService.sendWelcomeEmail(user.email, user.name || 'User');
  }
}
