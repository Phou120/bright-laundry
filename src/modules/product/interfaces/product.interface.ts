import { ProductType } from '@src/common/infrastructure/database/typeorms/entities/product.orm';

export interface Product {
  id: number;
  name: string;
  description?: string;
  product_type: ProductType;
  store_id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;

  // Relations
  store?: {
    id: number;
    name: string;
  };
}

export interface CreateProductDto {
  name: string;
  description?: string;
  product_type?: ProductType;
  store_id: number;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  product_type?: ProductType;
}

export interface ProductQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  store_id?: number;
  product_type?: ProductType;
  sort_by?: 'name' | 'product_type' | 'created_at' | 'updated_at';
  sort_order?: 'ASC' | 'DESC';
}
