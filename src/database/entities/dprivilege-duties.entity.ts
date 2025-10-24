import { Column, DeleteDateColumn, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({
  name: 'o_dprivilege_duties',
})
export class dprivilegeDutiesEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({
    name: 'updated_by',
    nullable: true,
  })
  updatedBy: string;

  @Column({
    name: 'created_by',
    nullable: true,
  })
  createdBy: string;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt: Date | null;
}
