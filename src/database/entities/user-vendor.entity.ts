import { PositionEntity } from './position.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({
  name: 'm_user_vendor',
})
export class UserVendorEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({
    name: 'phone_no',
  })
  phoneNo: string;

  @Column({
    name: 'responsible_user',
  })
  responsibleUser: number;

  @Column({
    name: 'company',
  })
  company: number;

  @Column({
    name: 'position',
  })
  positionId: number;

  @ManyToOne(() => PositionEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'position', referencedColumnName: 'id' })
  position: PositionEntity;

  @Column({
    name: 'nda_id',
  })
  ndaId: number;

  @Column({
    name: 'nda_file_path',
    nullable: true,
  })
  ndaFilePath: string;

  @Column({
    name: 'nda_expired_at',
    type: 'timestamp',
    nullable: true,
  })
  ndaExpiredAt: Date;

  @Column({
    name: 'nda_approved_at',
    type: 'timestamp',
    nullable: true,
  })
  ndaApprovedAt: Date;

  @Column({
    name: 'contract_expired_at',
    type: 'timestamp',
    nullable: true,
  })
  contractExpiredAt: Date;

  @Column()
  nik: number;

  @Column()
  status: number;

  @Column({
    name: 'position_job',
  })
  positionJob: number;

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

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
  })
  deletedAt: Date | null;
}
