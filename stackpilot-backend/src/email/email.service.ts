import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ISendMailOptions } from '@nestjs-modules/mailer';

export interface JobEmailData {
  title: string;
  company: string;
  location?: string;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  url: string;
}

export interface DailyDigestData {
  newJobs: number;
  topMatches: Array<{
    title: string;
    company: string;
    score: number;
  }>;
  savedJobs: number;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    try {
      const mailOptions: ISendMailOptions = {
        to: email,
        subject: 'Welcome to StackPilot!',
        template: 'welcome',
        context: {
          name,
          loginUrl: 'https://stackpilot.com/login',
        },
      };

      await this.mailerService.sendMail(mailOptions);
      this.logger.log(`Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error('Error sending welcome email:', error);
    }
  }

  async sendJobMatchesEmail(
    email: string,
    name: string,
    matches: JobEmailData[],
  ): Promise<void> {
    try {
      const topMatches = matches.slice(0, 5);

      const mailOptions: ISendMailOptions = {
        to: email,
        subject: `🎯 Top ${topMatches.length} Job Matches for You`,
        template: 'job-matches',
        context: {
          name,
          matches: topMatches,
          dashboardUrl: 'https://stackpilot.com/dashboard',
        },
      };

      await this.mailerService.sendMail(mailOptions);
      this.logger.log(`Job matches email sent to ${email}`);
    } catch (error) {
      this.logger.error('Error sending job matches email:', error);
    }
  }

  async sendDailyDigestEmail(
    email: string,
    name: string,
    data: DailyDigestData,
  ): Promise<void> {
    try {
      const mailOptions: ISendMailOptions = {
        to: email,
        subject: '📊 Your StackPilot Daily Digest',
        template: 'daily-digest',
        context: {
          name,
          newJobs: data.newJobs,
          topMatches: data.topMatches.slice(0, 3),
          savedJobs: data.savedJobs,
          dashboardUrl: 'https://stackpilot.com/dashboard',
        },
      };

      await this.mailerService.sendMail(mailOptions);
      this.logger.log(`Daily digest email sent to ${email}`);
    } catch (error) {
      this.logger.error('Error sending daily digest email:', error);
    }
  }

  async sendLimitWarningEmail(
    email: string,
    name: string,
    limitType: 'resume_scans' | 'job_searches',
    currentUsage: number,
    limit: number,
  ): Promise<void> {
    try {
      const percentage = Math.round((currentUsage / limit) * 100);

      const mailOptions: ISendMailOptions = {
        to: email,
        subject: `⚠️ You're reaching your ${limitType.replace('_', ' ')} limit`,
        template: 'limit-warning',
        context: {
          name,
          limitType: limitType.replace('_', ' '),
          currentUsage,
          limit,
          percentage,
          upgradeUrl: 'https://stackpilot.com/pricing',
        },
      };

      await this.mailerService.sendMail(mailOptions);
      this.logger.log(`Limit warning email sent to ${email}`);
    } catch (error) {
      this.logger.error('Error sending limit warning email:', error);
    }
  }
}
