import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({
  name: 'm_app_role_template',
})
export class AppRoleTemplateEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ name: 'data', type: 'jsonb' })
  data: any;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: number;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;
}
