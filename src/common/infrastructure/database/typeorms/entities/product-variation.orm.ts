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
import { ProductOrmEntity } from './product.orm';
import { EnumProductStatus } from '@src/common/enums/orm-entity-method.enum';

@Entity('product_variations')
export class ProductVariationOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  barcode?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  width?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  height?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  length?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  weight?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  sale_price?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  purchase_price?: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  product_id?: number;
  @ManyToOne(
    () => ProductOrmEntity,
    (products) => products.product_variations,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'product_id' })
  product: Relation<ProductOrmEntity>;

  @Column({
    type: 'enum',
    enum: EnumProductStatus,
    default: EnumProductStatus.DISABLE,
  })
  status: EnumProductStatus;

  @Index()
  @Column({ type: 'timestamp', nullable: true })
  expired_date?: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
