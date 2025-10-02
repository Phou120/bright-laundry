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
import { ProvinceOrmEntity } from './province.orm';
import { VillageOrmEntity } from './village.orm';

@Entity('districts')
export class DistrictOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  name_lo?: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  name_en?: string;

  @Index()
  @Column({ type: 'int', unsigned: true, nullable: true })
  province_id?: number;
  @ManyToOne(() => ProvinceOrmEntity, (province) => province.districts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'province_id' })
  province: Relation<ProvinceOrmEntity>;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(() => VillageOrmEntity, (village) => village.district)
  villages: Relation<VillageOrmEntity[]>;
}
