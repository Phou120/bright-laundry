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
import { StoreStatusOrmEntity } from './store-status.orm';
import { TaxOrmEntity } from './tax.orm';
import { StoreUserOrmEntity } from './store-user.orm';
import { StoreOpenCloseTimeOrmEntity } from './store-open-close-time.orm';
import { WashingMachineOrmEntity } from './washing-machine.orm';

@Entity('stores')
export class StoreOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  store_no?: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  tel?: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  map_link?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  bank_name?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  bank_account_number?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  policy?: string;

  @Index()
  @Column({ type: 'int', unsigned: true, nullable: true })
  store_status_id?: number;
  @ManyToOne(
    () => StoreStatusOrmEntity,
    (store_status) => store_status.stores,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'store_status_id' })
  store_status: Relation<StoreStatusOrmEntity>;

  @Index()
  @Column({ type: 'int', unsigned: true, nullable: true })
  tax_id?: number;
  @ManyToOne(() => TaxOrmEntity, (tax) => tax.stores, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'tax_id' })
  tax: Relation<TaxOrmEntity>;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(() => StoreUserOrmEntity, (storeUser) => storeUser.store)
  store_users: Relation<StoreUserOrmEntity[]>;

  @OneToMany(
    () => StoreOpenCloseTimeOrmEntity,
    (open_close_item) => open_close_item.store,
  )
  open_close_item: Relation<StoreOpenCloseTimeOrmEntity>;

  @OneToMany(
    () => WashingMachineOrmEntity,
    (washingMachine) => washingMachine.store,
  )
  washing_machines: Relation<WashingMachineOrmEntity[]>;
}
