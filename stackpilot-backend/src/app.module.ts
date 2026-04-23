import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';

import { AuthModule } from './auth/auth.module';
import { ResumeModule } from './resumes/resume.module';
import { JobsModule } from './jobs/jobs.module';
import { UsageModule } from './usage/usage.module';
import { AdminModule } from './admin/admin.module';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { AIModule } from './common/ai/ai.module';
import { HealthController } from './common/health/health.controller';

import { User } from './users/user.entity';
import { Resume } from './resumes/entities/resume.entity';
import { Job } from './jobs/entities/job.entity';
import { JobMatch } from './jobs/entities/job-match.entity';
import { UsageLog } from './usage/entities/usage-log.entity';
import { JSearchQuota } from './usage/entities/jsearch-quota.entity';
import { SavedJob } from './jobs/entities/saved-job.entity';
import { AdzunaQuota } from './usage/entities/adzuna-quota.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        ssl: {
          rejectUnauthorized: false,
        },
        entities: [
          User,
          Resume,
          Job,
          JobMatch,
          UsageLog,
          SavedJob,
          JSearchQuota,
          AdzunaQuota,
        ],
        synchronize: true,
        logging: true,
      }),
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    AuthModule,
    ResumeModule,
    JobsModule,
    UsageModule,
    AdminModule,
    UsersModule,
    EmailModule,
    MarketplaceModule,
    AIModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
