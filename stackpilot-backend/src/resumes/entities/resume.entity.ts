import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/user.entity';

export interface StructuredResumeData {
  personalInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  summary?: string;
  skills: string[];
  experience: Array<{
    company: string;
    title: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    description: string[];
    technologies?: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies?: string[];
    url?: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field?: string;
    startDate?: string;
    endDate?: string;
    gpa?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date?: string;
  }>;
  languages?: Array<{
    language: string;
    proficiency?: string;
  }>;
}

@Entity('resumes')
export class Resume {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  @Index()
  userId: string;

  @ManyToOne(() => User, (user) => user.resumes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'file_name', nullable: true })
  fileName?: string;

  @Column({ name: 'file_size', nullable: true, type: 'integer' })
  fileSize?: number;

  @Column({ name: 'mime_type', nullable: true })
  mimeType?: string;

  @Column({ name: 'raw_text', type: 'text' })
  rawText: string;

  @Column({
    name: 'structured_data',
    type: 'jsonb',
    nullable: true,
  })
  structuredData?: StructuredResumeData;

  @Column({ name: 'ats_score', type: 'integer', nullable: true })
  atsScore?: number;

  @Column({
    name: 'score_breakdown',
    type: 'jsonb',
    nullable: true,
  })
  scoreBreakdown?: {
    skillMatch: number;
    projectStrength: number;
    experienceRelevance: number;
    resumeStructure: number;
    keywordDensity: number;
    actionVerbs: number;
    total: number;
  };

  @Column({ name: 'is_primary', default: false })
  @Index()
  isPrimary: boolean;

  @Column({ name: 'version', default: 1 })
  version: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
