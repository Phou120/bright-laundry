import { EntityManager } from 'typeorm';
import { CreateDto } from '../dtos/create/create.dto';

export class CreateCommand {
  constructor(
    public readonly dto: CreateDto,
    public readonly manager?: EntityManager,
  ) {}
}
