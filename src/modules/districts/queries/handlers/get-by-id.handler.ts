import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByIdDistrictQuery } from '../get-by-id.query';
import { DistrictOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/district.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { READ_DISTRICT_REPOSITORY } from '@src/common/constants/inject-key';
import { IReadDistrictRepository } from '../../interfaces/repository.interface';
import { HttpStatus, Inject } from '@nestjs/common';
import { DomainException } from '@src/common/exceptions/domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';

@QueryHandler(GetByIdDistrictQuery)
export class GetByIdDistrictHandler
  implements IQueryHandler<GetByIdDistrictQuery>
{
  constructor(
    @Inject(READ_DISTRICT_REPOSITORY)
    private readonly _repository: IReadDistrictRepository,
  ) {}

  async execute(
    query: GetByIdDistrictQuery,
  ): Promise<ResponseResult<DistrictOrmEntity>> {
    const { id, manager } = query;

    if (isNaN(id)) {
      throw new DomainException(
        'errors.id_must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `id ${query.id}` },
      );
    }
    await findOneOrFail(
      query.manager,
      DistrictOrmEntity,
      {
        id: id,
      },
      `${id}`,
    );

    return await this._repository.getById(id, manager);
  }
}
