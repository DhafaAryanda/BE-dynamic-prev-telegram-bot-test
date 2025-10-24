import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RequestTaskEntity } from './request-task.entity';

@Entity({
  name: 'o_request_task_process_history',
})
export class RequestTaskProcessHistoryEntity extends BaseEntity {
  @Column({ name: 'request_task_id', type: Number, nullable: true })
  requestTaskId: number;

  @ManyToOne(() => RequestTaskEntity, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'request_task_id', referencedColumnName: 'id' })
  requestTask: RequestTaskEntity;

  @Column({ name: 'name', type: String, nullable: true })
  name: string;

  @Column({ name: 'data', type: 'jsonb', nullable: true })
  data: any;

  @Column({ name: 'created_by', type: Number, nullable: true })
  createdBy: number;
}
