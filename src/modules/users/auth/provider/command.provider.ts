import { Provider } from '@nestjs/common';
import { LoginHandler } from '../commands/handler/login.command.handler';
import { ValidateTokenPayloadHandler } from '../commands/handler/validate-toke-payload.handler';
import { LogOutHandler } from '../commands/handler/logout-command.handler';

export const authCommandProviders: Provider[] = [
  LoginHandler,
  ValidateTokenPayloadHandler,
  LogOutHandler,
];
