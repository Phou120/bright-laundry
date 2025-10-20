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

@Entity('store_open_close_times')
export class StoreOpenCloseTimeOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ type: 'int', nullable: true })
  start_day?: number | null;

  @Index()
  @Column({ type: 'int', nullable: true })
  close_day?: number | null;

  @Index()
  @Column({ type: 'time', nullable: true })
  start_time?: string | null;

  @Index()
  @Column({ type: 'time', nullable: true })
  end_time?: string | null;

  @Index()
  @Column({ type: 'int', unsigned: true, nullable: true })
  store_id?: number;
  @ManyToOne(() => StoreOrmEntity, (store) => store.open_close_item, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'store_id' })
  store: Relation<StoreOrmEntity>;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
