import { Provider } from '@nestjs/common';
import { ProductBrandDataAccessMapper } from '../mappers/brand.mapper';

export const BrandMapperProviders: Provider[] = [ProductBrandDataAccessMapper];
