import { EntityManager } from 'typeorm';
import { ChangePasswordDto } from '../dtos/change-password.dto';

export class ChangePasswordCommand {
  constructor(
    public readonly id: number,
    public readonly body: ChangePasswordDto,
    public readonly manager: EntityManager,
  ) {}
}
