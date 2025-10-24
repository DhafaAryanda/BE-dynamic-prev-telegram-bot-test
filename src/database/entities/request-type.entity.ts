import { Column, DeleteDateColumn, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { AppFlowEntity } from "./app-flow.entity";

@Entity({
  name: "m_request_type",
})
export class RequestTypeEntity extends BaseEntity {
  @Column({})
  name: string;

  @Column({})
  description: string;

  @Column({
    name: "updated_by",
    nullable: true,
  })
  updatedBy: number;

  @OneToMany(() => AppFlowEntity, (appFlow) => appFlow.requestType)
  appFlow: AppFlowEntity[];

  appFlowCustom: AppFlowEntity[];

  @Column({
    name: "created_by",
    nullable: true,
  })
  createdBy: number;

  @DeleteDateColumn({
    name: "deleted_at",
    type: "timestamp",
    nullable: true,
  })
  deletedAt: Date;
}
