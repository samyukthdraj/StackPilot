import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  title: string;

  @Column()
  @Index()
  company: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb', nullable: true })
  requiredSkills?: string[];

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  salaryMin?: number;

  @Column({ nullable: true })
  salaryMax?: number;

  @Column({ nullable: true })
  salaryCurrency?: string;

  @Column({ nullable: true })
  jobType?: string; // full-time, part-time, contract, etc.

  @Column({ nullable: true })
  @Index()
  source?: string; // adzuna, indeed, etc.

  @Column({ name: 'source_id', nullable: true })
  sourceId?: string; // Original ID from the source

  @Column({ name: 'job_url', nullable: true })
  jobUrl?: string;

  @Column({ name: 'company_url', nullable: true })
  companyUrl?: string;

  @Column({ name: 'posted_at', type: 'timestamp', nullable: true })
  @Index()
  postedAt?: Date;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
