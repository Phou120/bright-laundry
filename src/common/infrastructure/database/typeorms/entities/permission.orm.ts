import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { PermissionGroupOrmEntity } from './permission-group.orm';
import { UserHasPermissionOrmEntity } from './user-has-permission.orm';

@Entity('permissions')
export class PermissionOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  guard_name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  display_name: string;

  @Index()
  @Column({ type: 'int', unsigned: true, nullable: true })
  permission_group_id?: number;
  @ManyToOne(
    () => PermissionGroupOrmEntity,
    (permission_groups) => permission_groups.permissions,
  )
  @JoinColumn({ name: 'permission_group_id' })
  permission_groups: Relation<PermissionGroupOrmEntity[]>;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(
    () => UserHasPermissionOrmEntity,
    (userHasPermission) => userHasPermission.permission,
  )
  userHasPermissions: Relation<UserHasPermissionOrmEntity[]>;
}
