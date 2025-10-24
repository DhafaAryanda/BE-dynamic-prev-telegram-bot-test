import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { RequestStatusEntity } from "./request-status.entity";
import { RequestTypeEntity } from "./request-type.entity";

@Entity({
  name: "o_request",
})
export class RequestEntity extends BaseEntity {
  // TODO: delete nullable after dev
  @Column({ name: "request_type_id", type: Number, nullable: true })
  requestTypeId: number;

  // TODO: delete nullable after dev
  @ManyToOne(() => RequestTypeEntity, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "request_type_id", referencedColumnName: "id" })
  requestType: RequestTypeEntity;

  @Column({ type: String })
  identifier: string;

  @Column({ type: String })
  title: string;

  @Column({ name: "status", type: Number })
  statusId: number;

  @ManyToOne(() => RequestStatusEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "status", referencedColumnName: "id" })
  status: RequestStatusEntity;

  @Column({ name: "updated_by", type: Number, nullable: true })
  updatedBy: number | null;

  @Column({ name: "created_by", type: Number, nullable: true })
  createdBy: number | null;

  @Column({ name: "deleted_at", type: "timestamp", nullable: true })
  deletedAt: Date;
}
