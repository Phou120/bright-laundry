import { Injectable } from '@nestjs/common';
import { IAuthServiceInterface } from '../interfaces/service.interface';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LoginCommand } from '../commands/auth.command';
import { AuthDto } from '../dtos/auth.dto';
import { LogOutCommand } from '../commands/logout.command';

@Injectable()
export class AuthService implements IAuthServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async signIn(body: AuthDto, manager?: EntityManager): Promise<any> {
    return await this._commandBus.execute(
      new LoginCommand(body, manager ?? this._readEntityManager),
    );
  }

  async signOut(user_id: number, manager?: EntityManager): Promise<string> {
    return await this._commandBus.execute(
      new LogOutCommand(user_id, manager ?? this._readEntityManager),
    );
  }
}
