import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AppFlowEntity } from './app-flow.entity';
import { UserEntity } from './user.entity';
import { RequestTaskEntity } from './request-task.entity';
import { RequestStatusEntity } from './request-status.entity';

@Entity({
  name: 'o_request_task_process',
})
export class RequestTaskProcessEntity extends BaseEntity {
  @Column({ name: 'app_flow_id', type: Number })
  appFlowId: number;

  @ManyToOne(() => AppFlowEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'app_flow_id', referencedColumnName: 'id' })
  appFlow: AppFlowEntity;

  @Column({ name: 'approver_id', type: Number })
  approverId: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'approver_id', referencedColumnName: 'id' })
  approver: UserEntity;

  @Column({ name: 'request_task_id', type: Number })
  requestTaskId: number;

  @ManyToOne(() => RequestTaskEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'request_task_id', referencedColumnName: 'id' })
  requestTask: RequestTaskEntity;

  @Column({ name: 'status', type: Number })
  statusId: number;

  @ManyToOne(() => RequestStatusEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'status', referencedColumnName: 'id' })
  status: RequestStatusEntity;

  @Column({ name: 'comment', type: String })
  comment: string;

  @Column({ name: 'updated_by', type: Number, nullable: true })
  updatedBy: number;

  @Column({ name: 'created_by', type: Number, nullable: true })
  createdBy: number;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;
}
