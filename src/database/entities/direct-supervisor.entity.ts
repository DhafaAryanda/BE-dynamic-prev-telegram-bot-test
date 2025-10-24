import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PositionEntity } from './position.entity';
import { UserEntity } from './user.entity';

@Entity({
  name: 'm_direct_supervisor',
})
export class DirectSupervisorEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ name: 'user_id', type: Number })
  userId: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @Column({ name: 'position_id', type: Number })
  positionId: number;

  @ManyToOne(() => PositionEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'position_id', referencedColumnName: 'id' })
  position: PositionEntity;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: number;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;
}
