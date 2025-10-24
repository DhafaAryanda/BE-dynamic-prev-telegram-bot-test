import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AppRoleEntity } from './app-role.entity';

@Entity({
  name: 'm_dprivilege_activity',
})
export class dprivilegeActivityEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ name: 'app_role_id', type: Number })
  appRoleId: number;

  @ManyToOne(() => AppRoleEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'app_role_id', referencedColumnName: 'id' })
  appRole: AppRoleEntity;

  @Column()
  keyword: string;

  @Column()
  description: string;

  @Column({ name: 'updated_by', type: Number })
  updatedBy: number;

  @Column({ name: 'created_by', type: Number })
  createdBy: number;

  @Column({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date | null;
}
