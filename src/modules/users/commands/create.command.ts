import { EntityManager } from 'typeorm';
import { CreateDto } from '../dtos/create.dto';

export class CreateCommand {
  constructor(
    public readonly body: CreateDto,
    public readonly manager: EntityManager,
  ) {}
}
