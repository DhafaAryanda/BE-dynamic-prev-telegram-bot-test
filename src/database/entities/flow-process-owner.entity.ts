import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AppFlowEntity } from './app-flow.entity';
import { UserEntity } from './user.entity';

@Entity({
  name: 'm_flow_process_owner',
})
export class FlowProcessOwnerEntity extends BaseEntity {
  @Column({ name: 'app_flow_id', type: Number })
  appFlowId: number;

  @ManyToOne(() => AppFlowEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'app_flow_id', referencedColumnName: 'id' })
  appFlow: AppFlowEntity;

  @Column({ name: 'user_id', type: Number })
  userId: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;
}
