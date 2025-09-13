import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '@src/common/constants/jwt.constant';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ValidateTokenPayloadCommand } from '../commands/validate-token-payload.command';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';
import { CommandBus } from '@nestjs/cqrs';
import type { Request } from 'express';
import { TokenPayload } from '@src/common/interfaces/token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _commandBus: CommandBus) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: TokenPayload): Promise<UserOrmEntity> {
    const rawToken = (
      ExtractJwt.fromAuthHeaderAsBearerToken()(req) || ''
    ).trim();
    // Defensive: ensure we never carry the "Bearer " prefix
    const token = rawToken.replace(/^Bearer\s+/i, '');

    // strip standard claims if present
    const { iat, exp, ...rest } = (payload as any) ?? {};
    const safePayload = rest as TokenPayload;

    return await this._commandBus.execute(
      new ValidateTokenPayloadCommand(safePayload, token),
    );
  }
}
