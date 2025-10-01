import { EntityManager } from 'typeorm';
import { CreateStoreUserDto } from '../dtos/create/create.dto';

export class CreateStoreUserCommand {
  constructor(
    public userId: number,
    public dto: CreateStoreUserDto,
    public manager?: EntityManager,
  ) {}
}
