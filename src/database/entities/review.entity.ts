import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { ReviewEventEntity } from './review-event.entity';
import { AppEntity } from './app.entity';
import { ReviewReportEntity } from './review-report.entity';

@Entity({
  name: 'o_review',
})
export class ReviewEntity extends BaseEntity {
  @Column({ name: 'review_event_id', type: Number })
  reviewEventId: number;

  @ManyToOne(() => ReviewEventEntity, (reviewEvent) => reviewEvent.reviews, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'review_event_id' })
  reviewEvent: ReviewEventEntity;

  @Column({ name: 'created_by', type: 'int', nullable: true })
  createdBy: number | null;

  @Column({ name: 'app_id', type: Number })
  appId: number;

  @ManyToOne(() => AppEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'app_id' })
  app: AppEntity;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date;

  @Column({ name: 'closed_at', type: 'timestamptz', nullable: true })
  closedAt: Date;

  @OneToMany(() => ReviewReportEntity, (report) => report.review)
  reports: ReviewReportEntity[];
}
