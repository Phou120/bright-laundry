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
import { StoreOrmEntity } from './store.orm';
import { CustomerOrmEntity } from './customer.orm';
import { WashingMachineDetailOrmEntity } from './washing-machine-detail.orm';

@Entity('washing_machines')
export class WashingMachineOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ type: 'int', unsigned: true, nullable: true })
  store_id?: number;
  @ManyToOne(() => StoreOrmEntity, (store) => store.washing_machines, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'store_id' })
  store: Relation<StoreOrmEntity>;

  @Index()
  @Column({ type: 'int', unsigned: true, nullable: true })
  customer_id?: number;
  @ManyToOne(() => CustomerOrmEntity, (customer) => customer.washing_machines, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Relation<CustomerOrmEntity>;

  @Index()
  @Column({ type: 'timestamp', nullable: true })
  washing_date?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(
    () => WashingMachineDetailOrmEntity,
    (detail) => detail.washing_machine,
  )
  details: Relation<WashingMachineDetailOrmEntity[]>;
}
