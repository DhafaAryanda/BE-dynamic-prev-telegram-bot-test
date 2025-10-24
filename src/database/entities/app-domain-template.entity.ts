import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({
  name: 'm_app_domain_template',
})
export class AppDomainTemplateEntity extends BaseEntity {
  @Column({ type: String })
  name: string;

  @Column({ name: 'parent_id', type: Number, nullable: true })
  parentId: number;

  @ManyToOne(() => AppDomainTemplateEntity, (parent) => parent.children, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id', referencedColumnName: 'id' })
  parent: AppDomainTemplateEntity;

  @OneToMany(() => AppDomainTemplateEntity, (child) => child.parent)
  children: AppDomainTemplateEntity[];

  @Column({ name: 'created_by', type: Number, nullable: true })
  createdBy: number;

  @Column({ name: 'updated_by', type: Number, nullable: true })
  updatedBy: number;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
