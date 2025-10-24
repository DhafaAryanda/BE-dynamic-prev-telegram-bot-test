import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { ReviewEntity } from './review.entity';
import { ReviewHistoryEntity } from './review-history.entity';

@Entity({
  name: 'o_review_report',
})
export class ReviewReportEntity extends BaseEntity {
  @Column({ name: 'title', type: String, nullable: true })
  title?: string;

  @Column({ name: 'report_data', type: 'jsonb', nullable: true })
  report_data?: any;

  @ManyToOne(() => ReviewEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'review_id' })
  review?: ReviewEntity;

  @Column({ name: 'review_id', type: Number })
  reviewId: number;

  @Column({ name: 'updated_by', type: Number, nullable: true })
  updatedBy?: number;

  @Column({ name: 'created_by', type: Number, nullable: true })
  createdBy?: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => ReviewHistoryEntity, (history) => history.reviewReport, {
    cascade: true,
    eager: true,
  })
  history?: ReviewHistoryEntity[];
}
