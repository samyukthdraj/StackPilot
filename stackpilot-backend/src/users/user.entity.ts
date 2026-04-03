import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Resume } from '../resumes/entities/resume.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'auth_provider', default: 'local' })
  authProvider: 'local' | 'google' | 'github' | 'microsoft';

  @Column({ nullable: true })
  name?: string;

  @Column({ name: 'subscription_type', default: 'free' })
  subscriptionType: string;

  @Column({ name: 'daily_resume_scans', default: 0 })
  dailyResumeScans: number;

  @Column({ name: 'last_scan_reset', type: 'date', nullable: true })
  lastScanReset?: Date;

  @Column({ default: 'user' }) // Add role field
  role: string;

  @OneToMany(() => Resume, (resume) => resume.user)
  resumes: Resume[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({
    name: 'notification_preferences',
    type: 'jsonb',
    nullable: true,
    default: {
      email: {
        dailyDigest: true,
        newMatches: true,
        applicationReminders: true,
        marketing: false,
      },
      push: {
        newMatches: true,
        applicationUpdates: true,
      },
    },
  })
  notificationPreferences: {
    email: {
      dailyDigest: boolean;
      newMatches: boolean;
      applicationReminders: boolean;
      marketing: boolean;
    };
    push: {
      newMatches: boolean;
      applicationUpdates: boolean;
    };
  };

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
