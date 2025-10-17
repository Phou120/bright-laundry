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
import { ProductVariationOrmEntity } from './product-variation.orm';
import { ProductImageOrmEntity } from './product-image.orm';

export enum ProductType {
  STANDARD = 'standard',
  VARIATION = 'variation',
}

@Entity('products')
export class ProductOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: ProductType,
    default: ProductType.STANDARD,
    nullable: false,
  })
  product_type: ProductType;

  @Index()
  @Column({ type: 'int', unsigned: true, nullable: false })
  store_id: number;

  @ManyToOne(() => StoreOrmEntity, (store) => store.products, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'store_id' })
  store: Relation<StoreOrmEntity>;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(
    () => ProductVariationOrmEntity,
    (product_variations) => product_variations.product,
  )
  product_variations: Relation<ProductVariationOrmEntity[]>;

  @OneToMany(
    () => ProductImageOrmEntity,
    (product_images) => product_images.product,
  )
  product_images: Relation<ProductImageOrmEntity[]>;
}
