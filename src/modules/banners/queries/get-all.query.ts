import { IQuery } from '@nestjs/cqrs';
import { BannerQueryDto } from '../dtos/query/query.dto';

export class GetAllBannerQuery implements IQuery {
  constructor(public readonly query: BannerQueryDto) {}
}