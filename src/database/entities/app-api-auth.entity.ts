import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AppApiEntity } from './app-api.entity';

@Entity({
  name: 'm_app_api_auth',
})
export class AppApiAuthEntity extends BaseEntity {
  @Column({ name: 'app_api_id', unique: true })
  appApiId: number;

  @OneToOne(() => AppApiEntity, (appApi) => appApi.apiAuth, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'app_api_id', referencedColumnName: 'id' })
  appApi: AppApiEntity;

  @Column()
  method: string;

  @Column()
  path: string;

  @Column({ name: 'payload', type: 'jsonb' })
  payload: any;

  @Column({ name: 'response', type: 'jsonb' })
  response: any;

  @Column({
    name: 'updated_by',
    nullable: true,
  })
  updatedBy: number;

  @Column({
    name: 'created_by',
    nullable: true,
  })
  createdBy: number;

  @Column({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
  })
  deletedAt: Date | null;
}
