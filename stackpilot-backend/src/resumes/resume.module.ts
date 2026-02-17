import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resume } from './entities/resume.entity';
import { User } from '../users/user.entity';
import { ResumeController } from './controllers/resume.controller';
import { ResumeService } from './services/resume.service';
import { ResumeParserService } from './services/resume-parser.service';
import { ATSScoringService } from './services/ats-scoring.service';

@Module({
  imports: [TypeOrmModule.forFeature([Resume, User])],
  controllers: [ResumeController],
  providers: [ResumeService, ResumeParserService, ATSScoringService],
  exports: [ResumeService],
})
export class ResumeModule {}
