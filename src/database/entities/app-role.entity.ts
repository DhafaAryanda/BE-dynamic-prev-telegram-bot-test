import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { AppEntity } from "./app.entity";
import { AppProcessOwnerEntity } from "./app-process-owner.entity";

@Entity({
  name: "m_app_role",
})
export class AppRoleEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ name: "app_id", type: Number })
  appId: number;

  @ManyToOne(() => AppEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "app_id", referencedColumnName: "id" })
  app: AppEntity;

  @Column()
  description: string;

  @Column({ name: "updated_by", nullable: true })
  updatedBy: number;

  @Column({ name: "created_by", nullable: true })
  createdBy: number;

  @Column({ name: "deleted_at", type: "timestamp", nullable: true })
  deletedAt: Date;

  @OneToMany(
    () => AppProcessOwnerEntity,
    (appProcessOwner) => appProcessOwner.appRole
  )
  appProcessOwner: AppProcessOwnerEntity[];
}
