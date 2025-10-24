import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({
  name: 'm_notification_channel',
})
export class NotificationChannelEntity extends BaseEntity {
  @Column({ type: String })
  name: string;

  @Column({ name: 'created_by', type: Number, nullable: true })
  createdBy: number | null;
}
