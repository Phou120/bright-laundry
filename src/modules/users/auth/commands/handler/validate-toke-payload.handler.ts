import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { ValidateTokenPayloadCommand } from '../validate-token-payload.command';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';
import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@src/common/exceptions/domain.exception';
import { compare } from 'bcrypt';
import { GetUserQuery } from '@src/modules/users/queries/get-user.query';

@CommandHandler(ValidateTokenPayloadCommand)
export class ValidateTokenPayloadHandler
  implements ICommandHandler<ValidateTokenPayloadCommand, UserOrmEntity>
{
  constructor(private readonly _queryBus: QueryBus) {}

  async execute(command: ValidateTokenPayloadCommand): Promise<UserOrmEntity> {
    const user = await this._queryBus.execute<GetUserQuery, UserOrmEntity>(
      new GetUserQuery(command.payload.sub),
    );

    // Avoid logging sensitive tokens in production
    if (!user || !user.access_token) {
      throw new DomainException(
        'errors.auth.login_first',
        HttpStatus.UNAUTHORIZED,
        'domain-error',
      );
    }

    // If you store a bcrypt hash of the raw token at login, compare it here:
    if (!command.token) {
      throw new DomainException(
        'errors.auth.invalid_token',
        HttpStatus.UNAUTHORIZED,
        'domain-error',
      );
    }
    // If DB stores bcrypt hash (new flow), compare with bcrypt; otherwise fallback to plain equality
    let isMatch: boolean;
    if (/^\$2[aby]\$\d{2}\$/.test(user.access_token)) {
      // Compare the raw token with the stored bcrypt hash
      isMatch = await compare(command.token, user.access_token);
    } else {
      // Legacy: DB kept raw token; compare directly
      isMatch = command.token === user.access_token;
    }

    if (!isMatch) {
      throw new DomainException(
        'errors.auth.user_logged_out',
        HttpStatus.UNAUTHORIZED,
        'domain-error',
      );
    }

    return user;
  }
}
