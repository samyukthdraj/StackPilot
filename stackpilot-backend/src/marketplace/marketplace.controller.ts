import { Controller, Post, Body, Headers, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { ConfigService } from '@nestjs/config';

interface WebhookPayload {
  email?: string;
  action?: string;
  event?: string;
  secret?: string;
  sender?: {
    email?: string;
  };
  marketplace_purchase?: {
    account?: {
      email?: string;
    };
  };
}

@Controller('marketplace')
export class MarketplaceController {
  private readonly logger = new Logger(MarketplaceController.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  @Post('webhook')
  async handleWebhook(
    @Body() body: WebhookPayload,
    @Headers('x-hub-signature') _githubSignature: string,
    @Headers('authorization') authHeader: string,
  ) {
    this.logger.log('Received Marketplace Webhook event');
    this.logger.debug(`Webhook Body: ${JSON.stringify(body)}`);

    const webhookSecret = this.configService.get<string>(
      'MARKETPLACE_WEBHOOK_SECRET',
    );
    if (
      webhookSecret &&
      body.secret !== webhookSecret &&
      authHeader !== `Bearer ${webhookSecret}`
    ) {
      this.logger.warn('Unauthorized webhook attempt: invalid secret');
    }

    const email =
      body.email ||
      body.sender?.email ||
      body.marketplace_purchase?.account?.email;

    const action = body.action || body.event;

    if (!email) {
      this.logger.warn('Webhook received without user email identifier');
      return { status: 'ignored', message: 'No email found in payload' };
    }

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      this.logger.warn(`No user found for email: ${email}`);
      return { status: 'error', message: 'User not found' };
    }

    if (action === 'purchased' || action === 'changed' || action === 'active') {
      user.subscriptionType = 'pro_pilot';
      await this.userRepository.save(user);
      this.logger.log(`User ${email} upgraded to PRO_PILOT`);
    } else if (action === 'cancelled' || action === 'deleted') {
      user.subscriptionType = 'free';
      await this.userRepository.save(user);
      this.logger.log(`User ${email} downgraded to FREE`);
    }

    return { status: 'success', action, email };
  }
}
