import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { DomainException } from '@common/exceptions/domain.exception';
import { ITransformResultService } from '@common/interfaces/transform.interface';

@Injectable()
export class TransformResultService implements ITransformResultService {
  execute<Entity extends object, Response>(
    mapper: (entity: Entity) => Response,
    result?: ResponseResult<Entity>,
  ): ResponseResult<Response> {
    if (!result) {
      throw new DomainException(
        'domain.record_not_found',
        HttpStatus.NOT_FOUND,
      );
    }
    if ('data' in result && Array.isArray(result.data)) {
      return {
        ...result,
        // count_item: result.count_item,
        data: result.data.map(mapper),
      };
    } else if (Array.isArray(result)) {
      return result.map(mapper);
    } else if (result !== null) {
      return mapper(result as Entity);
    } else {
      throw new DomainException(
        'domain.record_not_found',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
