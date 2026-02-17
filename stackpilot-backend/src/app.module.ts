import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { ResumeModule } from './resumes/resume.module';
import { JobsModule } from './jobs/jobs.module';
import { UsageModule } from './usage/usage.module';
import { AdminModule } from './admin/admin.module'; // Add this
import { User } from './users/user.entity';
import { Resume } from './resumes/entities/resume.entity';
import { Job } from './jobs/entities/job.entity';
import { JobMatch } from './jobs/entities/job-match.entity';
import { UsageLog } from './usage/entities/usage-log.entity';
import { UsersModule } from './users/users.module';
import { SavedJob } from './jobs/entities/saved-job.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
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
        entities: [User, Resume, Job, JobMatch, UsageLog, SavedJob],
        synchronize: true,
        logging: true,
      }),
    }),
    AuthModule,
    ResumeModule,
    JobsModule,
    UsageModule,
    AdminModule,
    UsersModule,
  ],
})
export class AppModule {}
