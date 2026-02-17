import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Job } from './job.entity';
import { User } from '../../users/user.entity';

@Entity('job_matches')
export class JobMatch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  @Index()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'job_id' })
  @Index()
  jobId: string;

  @ManyToOne(() => Job)
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @Column({ type: 'float' })
  score: number; // 0-100 match score

  @Column({ type: 'jsonb', nullable: true })
  scoreBreakdown?: {
    skillMatch: number;
    keywordScore: number;
    experienceScore: number;
    recencyScore: number;
    total: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  matchedSkills?: string[];

  @Column({ type: 'jsonb', nullable: true })
  missingSkills?: string[];

  @Column({ default: false })
  viewed: boolean;

  @Column({ default: false })
  saved: boolean;

  @Column({ default: false })
  applied: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
