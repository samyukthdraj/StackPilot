import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../users/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { UsageLog } from '../usage/entities/usage-log.entity';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Job, UsageLog]),
    JobsModule, // Import JobsModule to get JobSyncService
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
