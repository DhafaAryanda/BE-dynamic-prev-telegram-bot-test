import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { AppRoleEntity } from "./app-role.entity";
import { AppDomainEntity } from "./app-domain.entity";
import { RequestTypeEntity } from "./request-type.entity";
import { AppAdminEntity } from "./app-admin.entity";
import { AppFlowEntity } from "./app-flow.entity";
import { AppApiEntity } from "./app-api.entity";

@Entity({
  name: "m_app",
})
export class AppEntity extends BaseEntity {
  @Column({ type: String })
  name: string;

  @Column({ type: String })
  description: string;

  @Column({ name: "is_uar", type: Boolean })
  isUar: boolean;

  @Column({ name: "uar_schedule", type: String, nullable: true })
  uarSchedule: string | null;

  @Column({ name: "uam_docs", type: String, nullable: true })
  uamDocs: string | null;

  @Column({ name: "is_valid", type: Boolean, default: false })
  isValid: boolean;

  @Column({ name: "is_api", type: Boolean, nullable: true })
  isApi: boolean;

  @Column({ name: "updated_by", type: Number, nullable: true })
  updatedBy: number | null;

  @Column({ name: "created_by", type: Number, nullable: true })
  createdBy: number | null;

  @Column({ name: "deleted_at", type: "timestamp", nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => AppRoleEntity, (role) => role.app)
  role: AppRoleEntity[];

  @OneToMany(() => AppDomainEntity, (domain) => domain.app)
  domain: AppDomainEntity[];

  @OneToMany(() => AppAdminEntity, (admin) => admin.app)
  admin: AppAdminEntity[];

  @OneToMany(() => AppFlowEntity, (appFlow) => appFlow.app)
  appFlow: AppFlowEntity[];

  @OneToMany(() => AppApiEntity, (appApi) => appApi.app)
  appApi: AppApiEntity[];

  @ManyToMany(() => RequestTypeEntity)
  @JoinTable({
    name: "m_app_request_type",
    joinColumn: {
      name: "app_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "request_type_id",
      referencedColumnName: "id",
    },
  })
  requestTypes: RequestTypeEntity[];
}
