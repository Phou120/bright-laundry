import { Provider } from '@nestjs/common';
import { ProvinceDataAccessMapper } from '../mappers/province.mapper';

export const MapperProviders: Provider[] = [ProvinceDataAccessMapper];
