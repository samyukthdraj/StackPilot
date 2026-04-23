import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Job } from './entities/job.entity';
import { JobMatch } from './entities/job-match.entity';
import { SavedJob } from './entities/saved-job.entity';
import { User } from '../users/user.entity';
import { EmailModule } from '../email/email.module';
import { ResumeModule } from '../resumes/resume.module';
import { UsageModule } from '../usage/usage.module';
import { JSearchQuota } from '../usage/entities/jsearch-quota.entity';
import { AdzunaQuota } from '../usage/entities/adzuna-quota.entity';

import { JobsController } from './controllers/jobs.controller';
import { SavedJobsController } from './controllers/saved-jobs.controller';
import { JobsService } from './services/jobs.service';
import { JobSyncService } from './services/job-sync.service';
import { JobMatchingService } from './services/job-matching.service';
import { SavedJobsService } from './services/saved-jobs.service';
import { HttpWrapperService } from './services/http-wrapper.service';
import { JSearchService } from './services/jsearch.service';
import { AdzunaService } from './services/adzuna.service';
import { ArbeitnowService } from './services/arbeitnow.service';
import { NotificationSchedulerService } from './services/notification-scheduler.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Job,
      JobMatch,
      SavedJob,
      User,
      JSearchQuota,
      AdzunaQuota,
    ]),
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
    ResumeModule,
    EmailModule,
    UsageModule,
  ],
  controllers: [SavedJobsController, JobsController],
  providers: [
    JobsService,
    JobSyncService,
    JobMatchingService,
    SavedJobsService,
    HttpWrapperService,
    JSearchService,
    AdzunaService,
    ArbeitnowService,
    NotificationSchedulerService,
  ],
  exports: [
    JobsService,
    JobMatchingService,
    SavedJobsService,
    JobSyncService,
    NotificationSchedulerService,
  ],
})
export class JobsModule {}
