import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByIdProvinceQuery } from '../get-by-id.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { IReadProvinceRepository } from '../../interfaces/repository.interface';
import { READ_PROVINCE_REPOSITORY } from '@src/common/constants/inject-key';
import { HttpStatus, Inject } from '@nestjs/common';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ProvinceOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/province.orm';
import { DomainException } from '@src/common/exceptions/domain.exception';

@QueryHandler(GetByIdProvinceQuery)
export class GetByIdProvinceQueryHandler
  implements
    IQueryHandler<GetByIdProvinceQuery, ResponseResult<ProvinceOrmEntity>>
{
  constructor(
    @Inject(READ_PROVINCE_REPOSITORY)
    private readonly _read: IReadProvinceRepository,
  ) {}

  async execute(
    query: GetByIdProvinceQuery,
  ): Promise<ResponseResult<ProvinceOrmEntity>> {
    if (isNaN(query.id)) {
      throw new DomainException(
        'errors.id_must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `id ${query.id}` },
      );
    }
    await findOneOrFail(
      query.manager,
      ProvinceOrmEntity,
      {
        id: query.id,
      },
      `${query.id}`,
    );
    return await this._read.getById(query.id, query.manager);
  }
}
