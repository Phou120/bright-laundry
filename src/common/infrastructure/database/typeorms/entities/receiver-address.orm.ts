import { EnumReceiverAddress } from '@src/common/enums/orm-entity-method.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { UserOrmEntity } from './user.orm';

@Entity('receiver_addresses')
export class ReceiverAddressOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  tel?: string;

  @Column({ type: 'boolean', default: false })
  is_current: boolean;

  @Index()
  @Column({ type: 'enum', enum: EnumReceiverAddress, nullable: true })
  type: EnumReceiverAddress;

  @Index()
  @Column({ type: 'int', unsigned: true, nullable: true })
  user_id?: number;
  @OneToOne(() => UserOrmEntity, (user) => user.receiver_address, {
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
