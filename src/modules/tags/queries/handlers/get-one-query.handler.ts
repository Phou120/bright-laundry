import { HttpStatus, Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneTagQuery } from '../get-one.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { TagOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/tag.orm';
import { READ_TAG_REPOSITORY } from '@src/common/constants/inject-key';
import { IReadTagRepository } from '../../interfaces/repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DomainException } from '@src/common/exceptions/domain.exception';

@QueryHandler(GetOneTagQuery)
export class GetOneTagQueryHandler
  implements IQueryHandler<GetOneTagQuery, ResponseResult<TagOrmEntity>>
{
  constructor(
    @Inject(READ_TAG_REPOSITORY)
    private readonly _read: IReadTagRepository,
  ) {}

  async execute(query: GetOneTagQuery): Promise<ResponseResult<TagOrmEntity>> {
    if (isNaN(query.id)) {
      throw new DomainException(
        'errors.id_must_be_number',
        HttpStatus.BAD_REQUEST,
        {
          property: `id ${query.id}`,
        },
      );
    }
    await findOneOrFail(
      query.manager,
      TagOrmEntity,
      { id: query.id },
      `${query.id}`,
    );
    return await this._read.getOne(query.id, query.manager);
  }
}
