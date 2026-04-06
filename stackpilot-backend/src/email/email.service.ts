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
          loginUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`,
          baseUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
        },
      };

      await this.mailerService.sendMail(mailOptions);
      this.logger.log(`Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error('Error sending welcome email:', error);
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

  async sendContactEmail(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<void> {
    try {
      const mailOptions: ISendMailOptions = {
        to: process.env.SUPPORT_EMAIL || 'edusmart500@gmail.com', // fallback to user's main inbox conceptually
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
