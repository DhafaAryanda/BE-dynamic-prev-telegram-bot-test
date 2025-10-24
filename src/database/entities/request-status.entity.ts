import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity({
  name: "m_request_status",
})
export class RequestStatusEntity extends BaseEntity {
  @Column({ name: "name", type: String })
  name: string;

  @Column({ name: "updated_by", type: Number, nullable: true })
  updatedBy: number | null;

  @Column({ name: "created_by", type: Number, nullable: true })
  createdBy: number | null;

  @Column({ name: "deleted_at", type: "timestamp", nullable: true })
  deletedAt: Date;
}
