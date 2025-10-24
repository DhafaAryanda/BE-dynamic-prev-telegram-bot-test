import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AppFlowEntity } from './app-flow.entity';

@Entity({
  name: 'm_dprivilege_tele_group',
})
export class dprivilegeTeleGroupEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({
    name: 'telegram_id',
  })
  telegramId: number;

  @Column({
    name: 'group_name',
  })
  groupName: string;

  @Column({
    name: 'flow_id',
  })
  flowId: number;

  @ManyToOne(() => AppFlowEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'flow_id', referencedColumnName: 'id' })
  flow: AppFlowEntity;

  @Column({
    name: 'created_by',
  })
  createdBy: number;

  @Column({
    name: 'updated_by',
  })
  updatedBy: number;

  @Column({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt: Date | null;
}
