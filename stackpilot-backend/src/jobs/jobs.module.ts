import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { Job } from './entities/job.entity';
import { JobMatch } from './entities/job-match.entity';
import { SavedJob } from './entities/saved-job.entity';
import { JobsController } from './controllers/jobs.controller';
import { SavedJobsController } from './controllers/saved-jobs.controller';
import { JobsService } from './services/jobs.service';
import { AdzunaService } from './services/adzuna.service';
import { JobSyncService } from './services/job-sync.service';
import { JobMatchingService } from './services/job-matching.service';
import { SavedJobsService } from './services/saved-jobs.service';
import { HttpWrapperService } from './services/http-wrapper.service';
import { ResumeModule } from '../resumes/resume.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, JobMatch, SavedJob]),
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
    ScheduleModule.forRoot(),
    ResumeModule,
  ],
  controllers: [SavedJobsController, JobsController],
  providers: [
    JobsService,
    AdzunaService,
    JobSyncService,
    JobMatchingService,
    SavedJobsService,
    HttpWrapperService,
  ],
  exports: [JobsService, JobMatchingService, SavedJobsService, JobSyncService],
})
export class JobsModule {}
