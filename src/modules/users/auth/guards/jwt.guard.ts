import {
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@src/common/decorator/auth.decorator';
import { AuthGuard } from '@nestjs/passport';
import { DomainException } from '@src/common/exceptions/domain.exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Fast path for public endpoints
    if (isPublic) return true;

    // Delegate token extraction and validation to passport-jwt to avoid duplicate work
    return super.canActivate(context);
  }

  // Narrow and validate the user to avoid unsafe returns
  handleRequest<TUser = any>(
    err: any,
    user: TUser,
    info: any,
    _context: ExecutionContext,
    _status?: any,
  ): TUser {
    void _context;
    void _status;

    if (err) {
      throw err instanceof Error ? err : new UnauthorizedException();
    }

    // Map passport-jwt errors to our i18n message keys consumed by global exception filter
    let message: string | undefined;
    if (info instanceof Error) {
      const name = (info as any).name as string | undefined;
      if (name === 'TokenExpiredError') {
        throw new DomainException(
          'errors.auth.token_expired',
          HttpStatus.UNAUTHORIZED,
        );
      } else if (name === 'JsonWebTokenError') {
        throw new DomainException(
          'errors.auth.invalid_token',
          HttpStatus.UNAUTHORIZED,
        );
      } else if (info.message === 'No auth token') {
        throw new DomainException(
          'errors.auth.no_token_provided',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }

    if (!user) {
      throw new UnauthorizedException(message);
    }

    return user;
  }
}
