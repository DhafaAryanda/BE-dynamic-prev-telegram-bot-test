import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { ReviewEntity } from "./review.entity";
import { RegisteredUserEntity } from "./registered-user.entity";
import { ReviewCodeEntity } from "./review-code.entity";

@Entity({
  name: "o_review_task",
})
export class ReviewTaskEntity extends BaseEntity {
  @Column({ name: "name", type: "varchar", nullable: true })
  name: string;

  @ManyToOne(() => ReviewEntity, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "review_id" })
  review: ReviewEntity;

  @Column({ name: "review_id", type: "int" })
  reviewId: number;

  @ManyToOne(() => RegisteredUserEntity, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "registered_user_id" })
  registeredUser: RegisteredUserEntity;

  @Column({ name: "registered_user_id", type: "int", nullable: true })
  registeredUserId: number | null;

  @Column({ name: "status", type: "int", nullable: true })
  status: number;

  @Column({ name: "updated_by", type: "int", nullable: true })
  updatedBy: number;

  @Column({ name: "created_by", type: "int", nullable: true })
  createdBy: number;

  @Column({ name: "closed_at", type: "timestamptz", nullable: true })
  closedAt: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt: Date;

  @ManyToOne(() => ReviewCodeEntity, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "review_code_id" })
  reviewCode: ReviewCodeEntity;

  @Column({ name: "review_code_id", type: "int" })
  reviewCodeId: number;
}
