import { EntityManager } from 'typeorm';
import { CreateAdminStoreUserDto } from '../dtos/create/admin-create.dto';

export class CreateAdminStoreUserCommand {
  constructor(
    public dto: CreateAdminStoreUserDto,
    public manager?: EntityManager,
  ) {}
}
