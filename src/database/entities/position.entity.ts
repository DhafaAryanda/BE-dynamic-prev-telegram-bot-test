import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { OrganizationEntity } from "./organization.entity";

@Entity({
  name: "m_position",
})
export class PositionEntity extends BaseEntity {
  @Column({
    name: "title_id",
    type: Number,
    nullable: true,
  })
  titleId: number;

  @Column({
    name: "name",
    type: String,
  })
  name: string;

  @Column({
    name: "title",
    type: String,
  })
  title: string;

  @Column({
    name: "user_id",
    type: Number,
    nullable: true,
  })
  userId: number;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: UserEntity;

  @Column({
    name: "pgs_user_id",
    type: Number,
  })
  pgsUserId: number;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "pgs_user_id", referencedColumnName: "id" })
  pgsUser: UserEntity;

  @Column({
    name: "poh_user_id",
    type: Number,
  })
  pohUserId: number;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "poh_user_id", referencedColumnName: "id" })
  pohUser: UserEntity;

  @Column({
    name: "organization_id",
    type: Number,
  })
  organizationId: number;

  @ManyToOne(() => OrganizationEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "organization_id", referencedColumnName: "id" })
  organization: OrganizationEntity;

  @Column({
    name: "created_by",
    type: Number,
    nullable: true,
    default: null,
  })
  createdBy?: number;

  @Column({
    name: "deleted_at",
    type: "timestamp",
    nullable: true,
    default: null,
  })
  deletedAt?: Date;
}
