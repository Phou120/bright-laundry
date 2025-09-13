import { Injectable } from '@nestjs/common';
import { IAuthServiceInterface } from '../interfaces/service.interface';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LoginCommand } from '../commands/auth.command';
import { AuthDto } from '../dtos/auth.dto';

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

  //   async signOut(userId: string): Promise<any> {
  //     // Implement signOut logic
  //   }
}
