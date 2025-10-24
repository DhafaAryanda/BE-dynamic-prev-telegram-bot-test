import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity({
  name: "m_permission",
})
export class permissionEntity extends BaseEntity {
  @Column({ type: String })
  name: string;

  @Column({ name: "created_by", type: Number, nullable: true })
  createdBy: number;
}
