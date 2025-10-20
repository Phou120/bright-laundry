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
import { WashingMachineOrmEntity } from './washing-machine.orm';
import { ClothesOrmEntity } from './clothe.orm';

@Entity('washing_machine_details')
export class WashingMachineDetailOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ type: 'int', unsigned: true, nullable: true })
  washing_machine_id?: number;
  @ManyToOne(
    () => WashingMachineOrmEntity,
    (washingMachine) => washingMachine.details,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'washing_machine_id' })
  washing_machine: Relation<WashingMachineOrmEntity>;

  @Index()
  @Column({ type: 'int', unsigned: true, nullable: true })
  clothes_id?: number;
  @ManyToOne(() => ClothesOrmEntity, (clothes) => clothes.details, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'clothes_id' })
  clothes: Relation<ClothesOrmEntity>;

  @Column({ type: 'int', nullable: true })
  quantity?: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  price?: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  total?: number;

  @Column({ type: 'decimal', precision: 18, scale: 5, nullable: true })
  vat?: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
