import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from '../auth.command';
import { Inject } from '@nestjs/common';
import { READ_USER_REPOSITORY } from '@src/common/constants/inject-key';
import { IReadUserRepository } from '@src/modules/users/interfaces/repository.interface';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand, any> {
  constructor(
    @Inject(READ_USER_REPOSITORY)
    private readonly _read: IReadUserRepository,
  ) {}

  async execute(command: LoginCommand): Promise<any> {
    const user = await this._read.signIn(command.body, command.manager);
    return user;
  }
}
