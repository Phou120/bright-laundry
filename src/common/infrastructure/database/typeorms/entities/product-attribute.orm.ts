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

@Entity('product_attributes')
export class ProductAttributeOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Column({ type: 'boolean', default: false })
  show_image: boolean;

  @Index()
  @Column({ type: 'int', unsigned: true, nullable: true })
  store_id?: number;
  @ManyToOne(() => StoreOrmEntity, (store) => store.product_attributes, {
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
