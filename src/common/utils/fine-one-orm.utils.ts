import { HttpStatus } from '@nestjs/common';
import { EntityManager, EntityTarget, ObjectLiteral } from 'typeorm';
import { DomainException } from '../exceptions/domain.exception';

export async function findOneOrFail<T extends ObjectLiteral>(
  manager: EntityManager,
  entityClass: EntityTarget<T>,
  where: Partial<T>,
  property?: string,
): Promise<T> {
  const entity = await manager.findOne(entityClass, { where });
  if (!entity) {
    throw new DomainException('errors.not_found', HttpStatus.NOT_FOUND, {
      property: property ?? 'data',
    });
  }

  return entity;
}
