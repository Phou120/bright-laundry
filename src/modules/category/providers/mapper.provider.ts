import { Provider } from '@nestjs/common';
import { CategoryDataAccessMapper } from '../mappers/category.mapper';

export const MapperProviders: Provider[] = [CategoryDataAccessMapper];
