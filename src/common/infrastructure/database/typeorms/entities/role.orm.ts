import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { UserOrmEntity } from './user.orm';

@Entity('roles')
export class RoleOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  display_name?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @ManyToMany(() => UserOrmEntity, (user: UserOrmEntity) => user.roles, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  users: Relation<UserOrmEntity[]>;
}
