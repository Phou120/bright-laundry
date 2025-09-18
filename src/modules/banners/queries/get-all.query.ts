import { EntityManager } from 'typeorm';
import { BannerQueryDto } from '../dtos/query/query.dto';

export class GetAllBannerQuery {
  constructor(
    public readonly query: BannerQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
