import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ReviewReportEntity } from './review-report.entity';

@Entity({
  name: 'o_review_history',
})
export class ReviewHistoryEntity extends BaseEntity {
  @Column({ name: 'name', type: String, nullable: true })
  name: string;

  @ManyToOne(() => ReviewReportEntity, (report) => report.history, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'review_report_id' })
  reviewReport: ReviewReportEntity;

  @Column({ name: 'review_report_id' })
  reviewReportId: number;

  @Column({ name: 'username', type: String })
  username: string;

  @Column({ name: 'role', type: Number })
  role: number;

  @Column({ name: 'action', type: String })
  action: string;

  @Column({ name: 'reviewed_by', type: 'jsonb' })
  reviewedBy: any;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt: Date;

  @Column({ name: 'expired_at', type: 'timestamptz', nullable: true })
  expiredAt: Date | null;

  @Column({ name: 'comment', type: String, nullable: true })
  comment: string;

  @Column({ name: 'updated_by', type: Number, nullable: true })
  updatedBy: number;

  @Column({ name: 'created_by', type: Number, nullable: true })
  createdBy: number;
}
