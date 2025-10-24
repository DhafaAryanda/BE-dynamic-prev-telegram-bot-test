import { Column, DeleteDateColumn, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({
  name: 'm_review_code',
})
export class ReviewCodeEntity extends BaseEntity {
  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'updated_by', type: 'int', nullable: true })
  updatedBy: number;

  @Column({ name: 'created_by', type: 'int', nullable: true })
  createdBy: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date;
}
