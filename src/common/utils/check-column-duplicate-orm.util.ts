import { HttpStatus } from '@nestjs/common';
import { EntityManager, Not } from 'typeorm';
import { DomainException } from '../exceptions/domain.exception';

export async function _checkColumnDuplicate<T>(
  entity: new () => T,
  field: keyof T,
  value: any,
  manager: EntityManager,
  errorMessage = '',
  excludeId?: number | string,
  property?: string,
): Promise<void> {
  const where: any = { [field]: value };

  if (excludeId) {
    where.id = Not(excludeId);
  }
  console.log('object');

  const existing = await manager.findOne(entity, { where });

  if (existing) {
    throw new DomainException(errorMessage, HttpStatus.BAD_REQUEST, {
      property: property || null,
    });
  }
}
