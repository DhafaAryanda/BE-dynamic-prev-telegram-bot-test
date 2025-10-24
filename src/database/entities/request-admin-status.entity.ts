import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RequestTaskEntity } from './request-task.entity';

@Entity({
  name: 'o_request_admin_status',
})
export class RequestAdminStatusEntity extends BaseEntity {
  @Column({
    name: 'request_task_id',
    type: Number,
  })
  requestTaskId: number;

  @ManyToOne(() => RequestTaskEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'request_task_id', referencedColumnName: 'id' })
  requestTask: RequestTaskEntity;

  @Column({
    name: 'ack_by',
    type: Number,
  })
  ackBy: number;

  @Column({
    name: 'ack_at',
    type: 'timestamp',
  })
  ackAt: Date;

  @Column({
    name: 'ack_expired_at',
    type: 'timestamp',
  })
  ackExpiredAt: Date;

  @Column({
    name: 'closed_by',
    type: Number,
    nullable: true,
  })
  closedBy: number | null;

  @Column({
    name: 'closed_at',
    type: 'timestamp',
    nullable: true,
  })
  closedAt: Date | null;

  @Column({
    name: 'closed_expired_at',
    type: 'timestamp',
    nullable: true,
  })
  closedExpiredAt: Date | null;
}
