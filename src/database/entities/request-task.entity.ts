import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { AppDomainEntity } from "./app-domain.entity";
import { AppFlowEntity } from "./app-flow.entity";
import { AppRoleEntity } from "./app-role.entity";
import { RequestAppEntity } from "./request-app.entity";
import { RequestTaskProcessEntity } from "./request-task-process.entity";
import { RequestAdminStatusEntity } from "./request-admin-status.entity";
import { RegisteredUserEntity } from "./registered-user.entity";

@Entity({
  name: "o_request_task",
})
@Unique("UQ_REQUEST_TASK_USERNAME_APP", ["usernameApp", "requestAppId"])
export class RequestTaskEntity extends BaseEntity {
  @Column({ name: "is_vendor", type: Number })
  isVendor: number;

  @Column({ name: "user_id", type: Number, nullable: true })
  userId: number;

  @Column({ name: "username_app", type: String, nullable: true })
  usernameApp: string;

  @Column({ name: "expired_at", type: "timestamp", nullable: true })
  expiredAt: Date;

  // TODO: delete nullable after dev
  @Column({
    name: "request_app_id",
    type: Number,
    nullable: true,
  })
  requestAppId: number;

  // TODO: delete nullable after dev
  @ManyToOne(() => RequestAppEntity, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "request_app_id", referencedColumnName: "id" })
  requestApp: RequestAppEntity;

  @Column({ name: "app_role_id", type: Number })
  appRoleId: number;

  @ManyToOne(() => AppRoleEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "app_role_id", referencedColumnName: "id" })
  appRole: AppRoleEntity;

  // TODO: delete nullable after dev
  @Column({ name: "app_domain_id", type: Number, nullable: true })
  appDomainId: number;

  @ManyToOne(() => AppDomainEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "app_domain_id", referencedColumnName: "id" })
  appDomain: AppDomainEntity;

  @Column({ name: "flow_current", type: Number })
  flowCurrentId: number;

  @ManyToOne(() => AppFlowEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "flow_current", referencedColumnName: "id" })
  flowCurrent: AppFlowEntity;

  @Column({ name: "flow_next", type: Number, nullable: true })
  flowNextId: number | null;

  @ManyToOne(() => AppFlowEntity, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "flow_next", referencedColumnName: "id" })
  flowNext: AppFlowEntity | null;

  @Column({ name: "is_active", type: Boolean, default: true })
  isActive: boolean;

  @Column({ name: "target_registered_user_id", type: Number, nullable: true })
  targetRegisteredUserId: number | null;

  @ManyToOne(() => RegisteredUserEntity, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "target_registered_user_id", referencedColumnName: "id" })
  targetRegisteredUser: RegisteredUserEntity;

  // TODO: delete nullable after dev
  @Column({ name: "updated_by", type: Number, nullable: true })
  updatedBy: number;

  @Column({ name: "created_by", type: Number })
  createdBy: number;

  @Column({ name: "deleted_at", type: "timestamp", nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => RequestTaskProcessEntity, (process) => process.requestTask)
  requestTaskProcesses: RequestTaskProcessEntity[];

  @OneToMany(() => RequestAdminStatusEntity, (status) => status.requestTask)
  requestAdminStatus: RequestAdminStatusEntity[];
}
