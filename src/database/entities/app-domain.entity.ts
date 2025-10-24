import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { AppEntity } from "./app.entity";

@Entity({
  name: "m_app_domain",
})
export class AppDomainEntity extends BaseEntity {
  @Column({ type: String })
  name: string;

  @Column({ name: "app_id", type: Number })
  appId: number;

  @ManyToOne(() => AppEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "app_id", referencedColumnName: "id" })
  app: AppEntity;

  @Column({ name: "parent_id", type: Number, nullable: true })
  parentId: number;

  @ManyToOne(() => AppDomainEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "parent_id", referencedColumnName: "id" })
  parent: AppDomainEntity;

  @Column({ name: "created_by", type: Number, nullable: true })
  createdBy: number;

  @Column({ name: "updated_by", type: Number, nullable: true })
  updatedBy: number;

  @Column({ name: "deleted_at", type: "timestamp", nullable: true })
  deletedAt: Date | null;
}
