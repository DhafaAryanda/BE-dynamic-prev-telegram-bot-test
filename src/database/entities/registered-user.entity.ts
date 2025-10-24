import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { RequestTaskEntity } from "./request-task.entity";
import { AppRoleEntity } from "./app-role.entity";
import { AppEntity } from "./app.entity";
import { AppDomainEntity } from "./app-domain.entity";

@Entity({
  name: "o_registered_user",
})
export class RegisteredUserEntity extends BaseEntity {
  @Column({ type: String })
  name: string;

  @Column({ name: "is_vendor", type: "boolean" })
  isVendor: boolean;

  @Column({ name: "user_id", type: Number, nullable: true })
  userId: number;

  @Column({ name: "app_id", type: Number, nullable: true })
  appId: number;

  @ManyToOne(() => AppEntity, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "app_id", referencedColumnName: "id" })
  app: AppEntity;

  @Column({ name: "app_role_id", type: Number, nullable: true })
  appRoleId: number;

  @ManyToOne(() => AppRoleEntity, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "app_role_id", referencedColumnName: "id" })
  appRole: AppRoleEntity;

  @Column({ name: "app_domain_id", type: Number, nullable: true })
  appDomainId: number;

  @ManyToOne(() => AppDomainEntity, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "app_domain_id", referencedColumnName: "id" })
  appDomain: AppDomainEntity;

  @Column({ name: "app_username", type: String, nullable: true })
  appUsername: string;

  @Column({ name: "app_password", type: String, nullable: true })
  appPassword: string;

  @Column({ name: "expired_at", type: "timestamp", nullable: true })
  expiredAt: Date;

  @Column({ name: "request_task_id", type: Number, nullable: true })
  requestTaskId: number;

  @ManyToOne(() => RequestTaskEntity, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "request_task_id", referencedColumnName: "id" })
  requestTask: RequestTaskEntity;

  @Column({ name: "requester_id", type: Number, nullable: true })
  requesterId: number;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "requester_id", referencedColumnName: "id" })
  requester: UserEntity;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive: boolean;

  @Column({ name: "link_token", type: String, nullable: true, unique: true })
  linkToken: string | null;

  @Column({ name: "link_expired_at", type: "timestamp", nullable: true })
  linkExpiredAt: Date | null;

  @Column({ name: "link_opened_at", type: "timestamp", nullable: true })
  linkOpenedAt: Date | null;

  @Column({ name: "updated_by", type: Number, nullable: true })
  updatedBy: number;

  @Column({ name: "created_by", type: Number, nullable: true })
  createdBy: number;

  @Column({ name: "deleted_at", type: "timestamp", nullable: true })
  deletedAt: Date | null;
}
