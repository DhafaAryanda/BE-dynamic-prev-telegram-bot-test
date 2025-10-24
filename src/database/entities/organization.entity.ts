import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity({
  name: "m_organization",
})
export class OrganizationEntity extends BaseEntity {
  @Column({
    name: "name",
    type: String,
  })
  name: string;

  @Column({
    name: "organization_id",
    type: Number,
  })
  organizationId: number;

  @Column({
    name: "department_id",
    type: Number,
  })
  departmentId: number;

  @Column({
    name: "division_id",
    type: Number,
  })
  divisionId: number;

  @Column({
    name: "parent_id",
    type: Number,
    nullable: true,
  })
  parentId: number | null;

  @Column({
    name: "level",
    type: Number,
  })
  level: number;

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
