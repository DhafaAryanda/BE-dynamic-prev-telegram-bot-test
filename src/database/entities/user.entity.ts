import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

@Entity("users")
@Index(["telegramId"], { unique: true })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "telegram_id", type: "bigint" })
  telegramId!: number;

  @Column({ name: "first_name", nullable: true })
  firstName?: string;

  @Column({ name: "last_name", nullable: true })
  lastName?: string;

  @Column({ name: "username", nullable: true })
  username?: string;

  @Column({ name: "language_code", nullable: true })
  languageCode?: string;

  @Column({ name: "is_bot", default: false })
  isBot: boolean = false;

  @Column({ name: "is_premium", default: false })
  isPremium: boolean = false;

  @Column({ name: "is_active", default: true })
  isActive: boolean = true;

  @Column({ name: "last_activity", type: "timestamp", nullable: true })
  lastActivity?: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  // Helper methods
  getFullName(): string {
    return `${this.firstName || ""} ${this.lastName || ""}`.trim();
  }

  getDisplayName(): string {
    return this.username ? `@${this.username}` : this.getFullName();
  }
}
