import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AppApiEntity } from './app-api.entity';
import { RequestTypeEntity } from './request-type.entity';

@Entity({
  name: 'm_app_api_scheme',
})
export class AppApiSchemeEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ name: 'app_api_id' })
  appApiId: number;

  @ManyToOne(() => AppApiEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'app_api_id', referencedColumnName: 'id' })
  appApi: AppApiEntity;

  @Column({ name: 'request_type_id' })
  requestTypeId: number;

  @ManyToOne(() => RequestTypeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'request_type_id', referencedColumnName: 'id' })
  requestType: RequestTypeEntity;

  @Column()
  methods: string;

  @Column()
  path: string;

  @Column({ name: 'is_form', nullable: true })
  isForm: boolean;

  @Column({ name: 'payload', type: 'jsonb' })
  payload: any;

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
