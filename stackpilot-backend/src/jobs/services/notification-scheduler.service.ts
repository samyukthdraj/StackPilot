import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { User } from '../../users/user.entity';
import { Job } from '../entities/job.entity';
import { JobMatch } from '../entities/job-match.entity';
import { SavedJob } from '../entities/saved-job.entity';
import { EmailService } from '../../email/email.service';

@Injectable()
export class NotificationSchedulerService {
  private readonly logger = new Logger(NotificationSchedulerService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(JobMatch)
    private jobMatchRepository: Repository<JobMatch>,
    @InjectRepository(SavedJob)
    private savedJobRepository: Repository<SavedJob>,
    private emailService: EmailService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendDailyDigests() {
    this.logger.log('Starting daily notification digest cycle...');

    try {
      // 1. Get all users who enabled daily digest
      const users = await this.userRepository.find();
      
      // Calculate 24h window
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      // 2. Count total new jobs in the market for everyone's summary
      const newJobsCount = await this.jobRepository.count({
        where: { createdAt: MoreThanOrEqual(oneDayAgo) }
      });

      for (const user of users) {
        if (!user.notificationPreferences?.email?.dailyDigest) continue;

        // 3. Get user-specific stats
        const [topMatches, savedJobsCount] = await Promise.all([
          this.jobMatchRepository.find({
            where: { userId: user.id },
            relations: ['job'],
            order: { score: 'DESC' },
            take: 3,
          }),
          this.savedJobRepository.count({
            where: { userId: user.id },
          }),
        ]);

        // 4. Send the high-fidelity digest
        if (topMatches.length > 0 || newJobsCount > 0) {
          await this.emailService.sendDailyDigestEmail(
            user.email,
            user.name || 'User',
            {
              newJobs: newJobsCount,
              savedJobs: savedJobsCount,
              topMatches: topMatches.map((m) => ({
                title: m.job.title,
                company: m.job.company,
                score: m.score,
              })),
            },
          );
          this.logger.debug(`Daily digest dispatched to ${user.email}`);
        }
      }

      this.logger.log(
        'Daily notification digest cycle completed successfully.',
      );
    } catch (error) {
      this.logger.error('Failed to complete daily digest cycle:', error);
    }
  }
}
