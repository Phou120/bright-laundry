import { EntityManager } from 'typeorm';
import { UpdateDto } from '../dtos/create/update.dto';

export class UpdateCommand {
  constructor(
    public id: number,
    public dto: UpdateDto,
    public manager?: EntityManager,
  ) {}
}
