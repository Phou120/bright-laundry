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
import { StoreOrmEntity } from './store.orm';
import { UserOrmEntity } from './user.orm';

@Entity('store_users')
export class StoreUserOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ type: 'int', unsigned: true, nullable: true })
  store_id?: number;
  @ManyToOne(() => StoreOrmEntity, (store) => store.store_users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'store_id' })
  store: Relation<StoreOrmEntity>;

  @Index()
  @Column({ type: 'int', unsigned: true, nullable: true })
  user_id?: number;
  @ManyToOne(() => UserOrmEntity, (user) => user.store_users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: Relation<UserOrmEntity>;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
