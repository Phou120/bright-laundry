import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { UserOrmEntity } from './user.orm';

@Entity('suppliers')
export class SupplierOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  company?: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  phone_number?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Index()
  @Column({ type: 'int', unsigned: true, nullable: true })
  created_by?: number;
  @ManyToOne(() => UserOrmEntity, (user) => user.suppliers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'created_by' })
  users: Relation<UserOrmEntity>;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
