import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { permissionEntity } from "./permission.entity";
import { UserEntity } from "./user.entity";

@Entity({
  name: "m_role",
})
export class roleEntity extends BaseEntity {
  @Column({ type: String })
  name: string;

  @Column({ type: String })
  description?: string;

  @Column({ name: "updated_by", type: Number, nullable: true })
  updatedBy: number;

  @Column({ name: "created_by", type: Number, nullable: true })
  createdBy: number;

  @ManyToMany(() => permissionEntity)
  @JoinTable({
    name: "m_role_permission",
    joinColumn: {
      name: "role_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "permission_id",
      referencedColumnName: "id",
    },
  })
  permissions: permissionEntity[];

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: UserEntity[];
}
