import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { AppEntity } from "./app.entity";
import { UserEntity } from "./user.entity";

@Entity({
  name: "m_app_admin",
})
export class AppAdminEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({
    name: "app_id",
  })
  appId: number;

  @ManyToOne(() => AppEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "app_id", referencedColumnName: "id" })
  app: AppEntity;

  @Column({
    name: "user_id",
  })
  userId: number;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: UserEntity;

  @Column({
    name: "created_by",
    nullable: true,
  })
  createdBy: string;
}
