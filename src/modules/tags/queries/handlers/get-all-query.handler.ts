import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllTagQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { TagOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/tag.orm';
import { Inject } from '@nestjs/common';
import { READ_TAG_REPOSITORY } from '@src/common/constants/inject-key';
import { IReadTagRepository } from '../../interfaces/repository.interface';

@QueryHandler(GetAllTagQuery)
export class GetAllTagQueryHandler
  implements IQueryHandler<GetAllTagQuery, ResponseResult<TagOrmEntity>>
{
  constructor(
    @Inject(READ_TAG_REPOSITORY)
    private readonly _read: IReadTagRepository,
  ) {}

  async execute(query: GetAllTagQuery): Promise<ResponseResult<TagOrmEntity>> {
    return await this._read.getAll(query.query, query.manager);
  }
}
