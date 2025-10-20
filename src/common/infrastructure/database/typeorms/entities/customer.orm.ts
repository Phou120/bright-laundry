import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { WashingMachineOrmEntity } from './washing-machine.orm';

@Entity('customers')
export class CustomerOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  surname?: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  tel?: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  address?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(
    () => WashingMachineOrmEntity,
    (washingMachine) => washingMachine.customer,
  )
  washing_machines: Relation<WashingMachineOrmEntity[]>;
}
