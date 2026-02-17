import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { Job } from './job.entity';

@Entity('saved_jobs')
@Unique(['userId', 'jobId'])
export class SavedJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  @Index()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'job_id' })
  @Index()
  jobId: string;

  @ManyToOne(() => Job, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @Column({ nullable: true, type: 'text' })
  notes?: string;

  @Column({ nullable: true, type: 'simple-array' })
  tags?: string[];

  @Column({ default: false })
  applied: boolean;

  @Column({ nullable: true, type: 'timestamp' })
  appliedAt?: Date; // Allow undefined

  @Column({ nullable: true, type: 'text' })
  applicationNotes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
