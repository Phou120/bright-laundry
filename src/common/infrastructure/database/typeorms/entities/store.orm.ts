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
import { StoreStatusOrmEntity } from './store-status.orm';
import { TaxOrmEntity } from './tax.orm';
import { EnumShipping } from '@src/common/enums/orm-entity-method.enum';

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
  short_name?: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  public_email?: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  phone_number?: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image?: string;

  @Column({ type: 'double precision', nullable: true })
  latitude?: number;

  @Column({ type: 'double precision', nullable: true })
  longitude?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  bank_name?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  account_number?: string;

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

  @Index()
  @Column({ type: 'boolean', default: false })
  is_top: boolean;

  @Index()
  @Column({ type: 'enum', enum: EnumShipping, default: EnumShipping.STORE })
  shipping: EnumShipping;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
