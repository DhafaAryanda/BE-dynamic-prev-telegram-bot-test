import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({
  name: 'm_notification',
})
export class NotificationEntity extends BaseEntity {
  @Column({ type: String })
  name: string;

  @Column({ type: String })
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'jsonb' })
  data: Record<string, any>;

  // TODO: delete nullable when template is implemented
  @Column({ type: Number, nullable: true, default: null })
  templateId: number | null;

  @Column({ name: 'updated_by', type: Number, nullable: true })
  updatedBy: number | null;

  @Column({ name: 'created_by', type: Number, nullable: true })
  createdBy: number | null;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
