import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { AppEntity } from './app.entity';

@Entity({
  name: 'm_review_import_userapp',
})
export class ReviewImportUserappEntity extends BaseEntity {
  @Column({ name: 'app_id', type: Number })
  appId: number;

  @ManyToOne(() => AppEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'app_id' })
  app: AppEntity;

  @Column({ name: 'username', type: 'varchar' })
  username: string;

  @Column({ name: 'role', type: 'int' })
  role: number;

  @Column({ name: 'expired_at', type: 'timestamp' })
  expiredAt: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'updated_by', type: Number, nullable: true })
  updatedBy: number | null;

  @Column({ name: 'created_by', type: Number, nullable: true })
  createdBy: number | null;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date;
}
