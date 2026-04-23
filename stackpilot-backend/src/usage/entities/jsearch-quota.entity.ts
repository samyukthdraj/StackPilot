import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Stores the most recently observed JSearch API quota from RapidAPI response headers.
 * There is only ever ONE row in this table (id = 'singleton').
 * We update it in-place on every JSearch API call.
 */
@Entity('jsearch_quota')
export class JSearchQuota {
  @PrimaryColumn()
  id: string;

  /** Total requests allowed in the current billing period */
  @Column({ name: 'requests_limit', default: 200 })
  requestsLimit: number;

  /** Remaining requests in the current billing period */
  @Column({ name: 'requests_remaining', default: 200 })
  requestsRemaining: number;

  /** Unix epoch seconds at which the quota resets */
  @Column({ name: 'requests_reset', nullable: true, type: 'bigint' })
  requestsReset: number | null;

  /** Total requests so far in billing period (derived) */
  @Column({ name: 'requests_used', default: 0 })
  requestsUsed: number;

  /** Last time a JSearch call was made */
  @UpdateDateColumn({ name: 'last_call_at' })
  lastCallAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
