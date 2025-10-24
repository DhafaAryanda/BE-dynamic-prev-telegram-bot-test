import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { AppEntity } from "./app.entity";
import { RequestEntity } from "./request.entity";
import { RequestStatusEntity } from "./request-status.entity";

@Entity({
  name: "o_request_app",
})
export class RequestAppEntity extends BaseEntity {
  @Column({ name: "app_id", type: Number })
  appId: number;

  @ManyToOne(() => AppEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "app_id", referencedColumnName: "id" })
  app: AppEntity;

  @Column({ type: String })
  title: string;

  @Column({ name: "request_id", type: Number })
  requestId: number;

  @ManyToOne(() => RequestEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "request_id", referencedColumnName: "id" })
  request: RequestEntity;

  @Column({ name: "status", type: Number })
  statusId: number;

  @ManyToOne(() => RequestStatusEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "status", referencedColumnName: "id" })
  status: RequestStatusEntity;

  @Column({ name: "created_by", type: Number })
  createdBy: number;

  @Column({ name: "updated_by", type: Number })
  updatedBy: number;

  @Column({ name: "deleted_at", type: "timestamp", nullable: true })
  deletedAt: Date | null;
}
