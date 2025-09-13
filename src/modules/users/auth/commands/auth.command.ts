import { EntityManager } from 'typeorm';
import { AuthDto } from '../dtos/auth.dto';

export class LoginCommand {
  constructor(
    public readonly body: AuthDto,
    public readonly manager: EntityManager,
  ) {}
}
