import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { dprivilegeActivityEntity } from './dprivilege-activity.entity';
import { dprivilegeDutiesEntity } from './dprivilege-duties.entity';
import { RequestTaskEntity } from './request-task.entity';

export enum TimezoneEnum {
  WIB = 'WIB',
  WITA = 'WITA',
  WIT = 'WIT',
}

@Entity({
  name: 'o_dprivilege_details',
})
export class dprivilegeDetailsEntity extends BaseEntity {
  @Column({ name: 'dprivilege_activity_id', type: Number })
  dprivilegeActivityId: number;

  @ManyToOne(() => dprivilegeActivityEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dprivilege_activity_id', referencedColumnName: 'id' })
  dprivilegeActivity: dprivilegeActivityEntity;

  @Column({ name: 'dprivilege_duties_id', type: Number })
  dprivilegeDutiesId: number;

  @ManyToOne(() => dprivilegeDutiesEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dprivilege_duties_id', referencedColumnName: 'id' })
  dprivilegeDuties: dprivilegeDutiesEntity;

  @Column({ name: 'request_task_id', type: Number, nullable: true })
  requestTaskId: number;

  @ManyToOne(() => RequestTaskEntity, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'request_task_id', referencedColumnName: 'id' })
  requestTask: RequestTaskEntity;

  @Column({ name: 'is_active', type: Boolean, default: true })
  isActive: boolean;

  @Column({ name: 'start_time', type: 'timestamptz', nullable: true })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamptz', nullable: true })
  endTime: Date;

  @Column({ name: 'is_vendor', type: 'boolean' })
  isVendor: boolean;

  @Column({ name: 'user_id', type: Number })
  userId: number;

  @Column({ name: 'cra_no', type: String, nullable: true })
  craNo: string;

  @Column({
    name: 'timezone',
    type: 'enum',
    enum: TimezoneEnum,
    nullable: true,
  })
  timezone: TimezoneEnum;

  @Column({ name: 'created_by', type: Number })
  createdBy: number;

  @Column({ name: 'updated_by', type: Number })
  updatedBy: number;

  @Column({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date | null;
}
