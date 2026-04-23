import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { DEFAULT_URLS } from '../common/constants';
import { UserRegisteredEvent } from '../auth/events/user-registered.event';
import { UserForgotPasswordEvent } from '../auth/events/user-forgot-password.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

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

import { JobMatchedEvent } from '../jobs/events/job-matched.event';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @OnEvent('user.registered')
  handleUserRegisteredEvent(payload: UserRegisteredEvent) {
    this.sendWelcomeEmail(payload.email, payload.name).catch((error) =>
      this.logger.error(
        `Failed to send welcome email to ${payload.email} from event:`,
        error,
      ),
    );
  }

  @OnEvent('user.forgotPassword')
  handleUserForgotPasswordEvent(payload: UserForgotPasswordEvent) {
    this.sendResetPasswordEmail(payload.email, payload.name, payload.token).catch((error) =>
      this.logger.error(
        `Failed to send reset password email to ${payload.email} from event:`,
        error,
      ),
    );
  }

  @OnEvent('job.matched')
  async handleJobMatchedEvent(payload: JobMatchedEvent) {
    try {
      // Check for weekly rate limit
      const user = await this.userRepository.findOne({
        where: { id: payload.userId },
        select: ['id', 'lastJobMatchEmailSentAt'],
      });

      if (user?.lastJobMatchEmailSentAt) {
        const lastSent = new Date(user.lastJobMatchEmailSentAt);
        const now = new Date();
        const diffInDays =
          (now.getTime() - lastSent.getTime()) / (1000 * 3600 * 24);

        if (diffInDays < 7) {
          this.logger.log(
            `Skipping job match email for ${payload.email} - sent ${Math.round(diffInDays)} days ago`,
          );
          return;
        }
      }

      await this.sendJobMatchesEmail(payload.email, payload.userName, [
        payload.job,
      ]);

      // Update timestamp
      await this.userRepository.update(payload.userId, {
        lastJobMatchEmailSentAt: new Date(),
      });
    } catch (error) {
      this.logger.error(
        `Failed to handle job matched event for ${payload.email}:`,
        error,
      );
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    try {
      const frontendUrl =
        this.configService.get<string>('FRONTEND_URL') ||
        DEFAULT_URLS.FRONTEND_URL;

      const mailOptions: ISendMailOptions = {
        to: email,
        subject: 'Welcome to StackPilot!',
        template: 'welcome',
        context: {
          name,
          loginUrl: `${frontendUrl}/login`,
          baseUrl: frontendUrl,
        },
      };

      await this.mailerService.sendMail(mailOptions);
      this.logger.log(`Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error('Error sending welcome email:', error);
      throw error;
    }
  }

  async sendResetPasswordEmail(email: string, name: string, token: string): Promise<void> {
    try {
      const frontendUrl =
        this.configService.get<string>('FRONTEND_URL') ||
        DEFAULT_URLS.FRONTEND_URL;
        
      const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

      const mailOptions: ISendMailOptions = {
        to: email,
        subject: 'Reset Your StackPilot Password',
        template: 'reset-password',
        context: {
          name,
          resetUrl,
          baseUrl: frontendUrl,
        },
      };

      await this.mailerService.sendMail(mailOptions);
      this.logger.log(`Reset password email sent to ${email}`);
    } catch (error) {
      this.logger.error('Error sending reset password email:', error);
      throw error;
    }
  }

  async sendJobMatchesEmail(
    email: string,
    name: string,
    matches: JobEmailData[],
  ): Promise<void> {
    try {
      const topMatches = matches.slice(0, 5);
      const frontendUrl =
        this.configService.get<string>('FRONTEND_URL') ||
        DEFAULT_URLS.FRONTEND_URL;

      const mailOptions: ISendMailOptions = {
        to: email,
        subject: `Top ${topMatches.length} Job Matches for You`,
        template: 'job-matches',
        context: {
          name,
          matches: topMatches,
          dashboardUrl: `${frontendUrl}/dashboard`,
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
      const frontendUrl =
        this.configService.get<string>('FRONTEND_URL') ||
        DEFAULT_URLS.FRONTEND_URL;

      const mailOptions: ISendMailOptions = {
        to: email,
        subject: 'Your StackPilot Daily Digest',
        template: 'daily-digest',
        context: {
          name,
          newJobs: data.newJobs,
          topMatches: data.topMatches.slice(0, 3),
          savedJobs: data.savedJobs,
          dashboardUrl: `${frontendUrl}/dashboard`,
        },
      };

      await this.mailerService.sendMail(mailOptions);
      this.logger.log(`Daily digest email sent to ${email}`);
    } catch (error) {
      this.logger.error('Error sending daily digest email:', error);
    }
  }

  async sendContactEmail(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<void> {
    try {
      const supportEmail =
        this.configService.get<string>('SUPPORT_EMAIL') ||
        DEFAULT_URLS.SUPPORT_EMAIL;

      const mailOptions: ISendMailOptions = {
        to: supportEmail,
        replyTo: data.email,
        subject: `New Contact Form Submission: ${data.subject}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h3 style="color: #111; border-bottom: 2px solid #f5c842; padding-bottom: 10px;">StackPilot Contact Form Submission</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Subject:</strong> ${data.subject}</p>
            <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #f5c842; line-height: 1.6;">
              ${data.message.replace(/\n/g, '<br/>')}
            </div>
            <p style="margin-top: 30px; font-size: 12px; color: #888;">This email was automatically generated from the StackPilot platform contact form.</p>
          </div>
        `,
      };

      await this.mailerService.sendMail(mailOptions);
      this.logger.log(`Contact email received from ${data.email}`);
    } catch (error) {
      this.logger.error('Error sending contact email from form:', error);
      throw error;
    }
  }
}
