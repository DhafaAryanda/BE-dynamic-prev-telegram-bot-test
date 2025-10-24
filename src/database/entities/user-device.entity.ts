import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";

@Entity({
  name: "m_user_device",
})
export class UserDeviceEntity extends BaseEntity {
  @Column({
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    name: "user_id",
    nullable: false,
  })
  userId: number;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: UserEntity;

  @Column({
    name: "last_verified",
    type: "timestamp",
    nullable: true,
    default: null,
  })
  lastVerified?: Date;

  @Column({
    type: "json",
    nullable: true,
    default: null,
  })
  fingerprints?: Record<string, any>;

  @Column({
    name: "user_agents",
    type: "json",
    nullable: true,
    default: null,
  })
  userAgents?: string[];

  @Column({
    name: "ip_address",
    type: "varchar",
    length: 100,
    nullable: true,
    default: null,
  })
  ipAddress?: string;

  @Column({
    name: "refresh_token",
    nullable: true,
    default: null,
  })
  refreshToken?: string;

  @Column({
    name: "created_by",
    nullable: true,
    default: null,
  })
  createdBy?: number;

  @Column({
    name: "last_interaction_at",
    type: "timestamp",
    nullable: true,
    default: null,
  })
  lastInteractionAt?: Date;
}
