import { Column, DeleteDateColumn, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ReviewEntity } from './review.entity';

@Entity({
  name: 'o_review_event',
})
export class ReviewEventEntity extends BaseEntity {
  @Column({ name: 'title', type: 'varchar' })
  title: string;

  @Column({ name: 'scheduled_by', type: 'int', nullable: true })
  scheduledBy: number | null;

  @Column({ name: 'due_date', type: 'timestamptz' })
  dueDate: Date;

  @Column({ name: 'status', type: 'int' })
  status: number;

  @Column({ name: 'created_by', type: Number, nullable: true })
  createdBy: number | null;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt: Date;

  @OneToMany(() => ReviewEntity, (review) => review.reviewEvent)
  reviews: ReviewEntity[];
}
