import { Provider } from '@nestjs/common';
import { DistrictDataAccessMapper } from '../mappers/district.mapper';

export const MapperProviders: Provider[] = [DistrictDataAccessMapper];
