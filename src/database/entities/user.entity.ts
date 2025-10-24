import * as bcrypt from "bcrypt";
import { Exclude } from "class-transformer";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { roleEntity } from "./role.entity";

@Entity({
  name: "m_user",
})
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  name: string;

  @Column()
  @Exclude()
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @Column({
    name: "is_api",
    default: false,
  })
  isApi: boolean;

  @Column({
    name: "telegram_id",
    nullable: true,
  })
  telegramId: number;

  @Column({
    name: "telegram_verified_at",
    type: "timestamp",
    nullable: true,
  })
  telegramVerifiedAt: Date;

  @Column({
    name: "is_ldap",
  })
  isLdap: boolean;

  @Column({
    name: "activated_at",
    type: "timestamp",
    nullable: true,
  })
  activatedAt: Date;

  @Column({
    name: "phone_no",
    nullable: true,
  })
  phoneNo: string;

  @Column({ unique: true })
  email: string;

  @Column({
    name: "from_date",
    type: "timestamp",
    nullable: true,
  })
  fromDate: Date;

  @Column({
    name: "is_2fa_enabled",
    default: false,
  })
  is2faEnabled: boolean;

  @Column({
    name: "last_login",
    nullable: true,
  })
  lastLogin: string;

  @Column({
    name: "email_verified_at",
    type: "timestamp",
    nullable: true,
  })
  emailVerifiedAt: Date;

  @Column({
    name: "is_active",
  })
  isActive: boolean;

  @Column({
    name: "nda_file_path",
    nullable: true,
  })
  ndaFilePath: string;

  @Column({
    name: "nda_expired_at",
    type: "timestamp",
    nullable: true,
  })
  ndaExpiredAt: Date;

  @Column({
    name: "nda_approved_at",
    type: "timestamp",
    nullable: true,
  })
  ndaApprovedAt: Date;

  @Column({
    name: "ppa_approved_at",
    type: "timestamp",
    nullable: true,
  })
  ppaApprovedAt: Date;

  @Column({ name: "dpa_approved_at", type: "timestamp", nullable: true })
  dpaApprovedAt: Date;

  @Column({
    name: "updated_by",
    nullable: true,
  })
  updatedBy: string;

  @Column({
    name: "created_by",
    nullable: true,
  })
  createdBy: string;

  @DeleteDateColumn({
    name: "deleted_at",
    type: "timestamp",
    nullable: true,
  })
  deletedAt: Date;

  @ManyToMany(() => roleEntity, (role) => role.users)
  @JoinTable({
    name: "m_user_role", // pivot table
    joinColumn: {
      name: "user_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "role_id",
      referencedColumnName: "id",
    },
  })
  roles?: roleEntity[];
}
