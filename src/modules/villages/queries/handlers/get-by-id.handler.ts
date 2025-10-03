import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByIdVillageQuery } from '../get-by-id.query';
import { VillageOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/village.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { READ_VILLAGE_REPOSITORY } from '@src/common/constants/inject-key';
import { IReadVillageRepository } from '../../interfaces/repository.interface';
import { HttpStatus, Inject } from '@nestjs/common';
import { DomainException } from '@src/common/exceptions/domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';

@QueryHandler(GetByIdVillageQuery)
export class GetByIdVillageHandler
  implements
    IQueryHandler<GetByIdVillageQuery, ResponseResult<VillageOrmEntity>>
{
  constructor(
    @Inject(READ_VILLAGE_REPOSITORY)
    private readonly _repository: IReadVillageRepository,
  ) {}

  async execute(
    query: GetByIdVillageQuery,
  ): Promise<ResponseResult<VillageOrmEntity>> {
    const { id, manager } = query;

    if (isNaN(id)) {
      throw new DomainException(
        'errors.id_must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `id ${query.id}` },
      );
    }
    await findOneOrFail(
      manager,
      VillageOrmEntity,
      {
        id: id,
      },
      `${id}`,
    );

    return await this._repository.getById(id, manager);
  }
}
