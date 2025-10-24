import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { AppEntity } from "./app.entity";
import { AppApiAuthEntity } from "./app-api-auth.entity";
import { AppApiSchemeEntity } from "./app-api-scheme.entity";

@Entity({
  name: "m_app_api",
})
export class AppApiEntity extends BaseEntity {
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
    name: "auth_method",
    nullable: true,
    type: "int",
  })
  authMethod: number | null;

  @Column({
    name: "username",
    nullable: true,
    type: "varchar",
  })
  username?: string | null;

  @Column({
    name: "password",
    nullable: true,
    type: "varchar",
  })
  password?: string | null;

  @Column({
    name: "token",
    nullable: true,
    type: "varchar",
  })
  token: string | null;

  @Column({
    name: "base_url",
  })
  baseUrl: string;

  @OneToOne(() => AppApiAuthEntity, (auth) => auth.appApi, { cascade: true })
  apiAuth: AppApiAuthEntity;

  @OneToMany(() => AppApiSchemeEntity, (scheme) => scheme.appApi, {
    cascade: true,
  })
  apiScheme: AppApiSchemeEntity[];

  @Column({
    name: "updated_by",
    nullable: true,
  })
  updatedBy: number;

  @Column({
    name: "created_by",
    nullable: true,
  })
  createdBy: number;

  @Column({
    name: "deleted_at",
    type: "timestamp",
    nullable: true,
  })
  deletedAt: Date | null;
}
