import { EnumPaymentMethod } from '@src/common/enums/orm-entity-method.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payment_methods')
export class PaymentMethodOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  method?: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  icon?: string;

  @Index()
  @Column({ type: 'enum', enum: EnumPaymentMethod, nullable: true })
  status?: EnumPaymentMethod;

  @Column({ type: 'int', nullable: true })
  sort_order?: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
