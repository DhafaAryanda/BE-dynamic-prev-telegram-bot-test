import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AppRoleEntity } from './app-role.entity';
import { UserEntity } from './user.entity';

@Entity({
  name: 'm_app_process_owner',
})
export class AppProcessOwnerEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ name: 'app_role_id', type: Number })
  appRoleId: number;

  @ManyToOne(() => AppRoleEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'app_role_id', referencedColumnName: 'id' })
  appRole: AppRoleEntity;

  @Column({ name: 'user_id', type: Number })
  userId: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: number;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;
}
