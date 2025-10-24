import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { RequestTypeEntity } from "./request-type.entity";
import { AppDomainEntity } from "./app-domain.entity";
import { AppRoleEntity } from "./app-role.entity";
import { AppEntity } from "./app.entity";
import { FlowProcessOwnerEntity } from "./flow-process-owner.entity";

@Entity({
  name: "m_app_flow",
})
export class AppFlowEntity extends BaseEntity {
  @Column({ type: String })
  name: string;

  // TODO: delete nullable after migration
  @Column({ name: "app_id", type: Number, nullable: true })
  appId: number | null;

  @ManyToOne(() => AppEntity, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "app_id", referencedColumnName: "id" })
  app: AppEntity;

  @Column({ name: "app_role_id", type: Number, nullable: true })
  appRoleId: number;

  @ManyToOne(() => AppRoleEntity, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "app_role_id", referencedColumnName: "id" })
  appRole: AppRoleEntity;

  @Column({ name: "domain_id", type: Number, nullable: true })
  domainId: number;

  @ManyToOne(() => AppDomainEntity, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "domain_id", referencedColumnName: "id" })
  domain: AppDomainEntity;

  @Column({ name: "request_type_id", type: Number })
  requestTypeId: number;

  @ManyToOne(() => RequestTypeEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "request_type_id", referencedColumnName: "id" })
  requestType: RequestTypeEntity;

  @Column({ type: Number })
  sequence: number;

  @Column({ name: "responsible_type", type: Number })
  responsibleType: number;

  @Column({ name: "parent_flow_id", type: Number, nullable: true })
  parentFlowId: number | null;

  @ManyToOne(() => AppFlowEntity, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "parent_flow_id", referencedColumnName: "id" })
  parentFlow: AppFlowEntity;

  @Column({ name: "is_default", type: Boolean, default: true })
  isDefault: boolean;

  @OneToMany(() => FlowProcessOwnerEntity, (owner) => owner.appFlow, {
    onDelete: "CASCADE",
  })
  owner: FlowProcessOwnerEntity[];

  @Column({ name: "updated_by", type: Number, nullable: true })
  updatedBy: number | null;

  @Column({ name: "created_by", type: Number, nullable: true })
  createdBy: number | null;

  @Column({ name: "deleted_at", type: "timestamp", nullable: true })
  deletedAt: Date;

  @OneToMany(
    () => FlowProcessOwnerEntity,
    (flowProcessOwner) => flowProcessOwner.appFlow
  )
  flowProcessOwners: FlowProcessOwnerEntity[];
}
