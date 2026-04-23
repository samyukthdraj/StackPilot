import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Stores the most recently observed Adzuna API quota.
 * There is only ever ONE row in this table (id = 'singleton').
 * We update it in-place on every Adzuna API call.
 */
@Entity('adzuna_quota')
export class AdzunaQuota {
  @PrimaryColumn()
  id: string;

  /** Total requests allowed per month */
  @Column({ name: 'requests_limit', default: 2500 })
  requestsLimit: number;

  /** Remaining requests in the current billing period */
  @Column({ name: 'requests_remaining', default: 2500 })
  requestsRemaining: number;

  /** Unix epoch seconds at which the quota resets */
  @Column({ name: 'requests_reset', nullable: true, type: 'bigint' })
  requestsReset: number | null;

  /** Last time an Adzuna call was made */
  @UpdateDateColumn({ name: 'last_call_at' })
  lastCallAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
