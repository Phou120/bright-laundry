import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { PermissionOrmEntity } from './permission.orm';
import { EnumType } from '@src/common/enums/orm-entity-method.enum';

@Entity('permission_groups')
export class PermissionGroupOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  display_name: string;

  @Index()
  @Column({ type: 'enum', enum: EnumType, default: EnumType.ALL })
  type: EnumType;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(
    () => PermissionOrmEntity,
    (permissions) => permissions.permission_groups,
  )
  permissions: Relation<PermissionOrmEntity[]>;
}
