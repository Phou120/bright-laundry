import { Provider } from '@nestjs/common';
import { TaxDataAccessMapper } from '../mappers/tax.mapper';

export const MapperProviders: Provider[] = [TaxDataAccessMapper];
