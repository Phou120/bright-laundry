import { EntityManager } from 'typeorm';
import { ResetPasswordDto } from '../dtos/reset-password.dto';

export class ResetPasswordCommand {
  constructor(
    public readonly id: number,
    public readonly body: ResetPasswordDto,
    public readonly manager: EntityManager,
  ) {}
}
