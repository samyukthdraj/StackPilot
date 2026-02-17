import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { Resume } from '../resumes/entities/resume.entity';
import { JobMatch } from '../jobs/entities/job-match.entity';
import { SavedJob } from '../jobs/entities/saved-job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Resume, JobMatch, SavedJob])],
  controllers: [UsersController],
  exports: [TypeOrmModule],
})
export class UsersModule {}
