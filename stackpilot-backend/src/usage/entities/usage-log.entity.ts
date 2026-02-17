import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/user.entity';

export enum UsageAction {
  RESUME_SCAN = 'resume_scan',
  JOB_SEARCH = 'job_search',
  JOB_VIEW = 'job_view',
  JOB_SAVE = 'job_save',
  MATCH_VIEW = 'match_view',
}

@Entity('usage_logs')
export class UsageLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  @Index()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: UsageAction,
  })
  action: UsageAction;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: {
    resumeId?: string;
    jobId?: string;
    searchQuery?: string;
    resultsCount?: number;
  };

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
