import { Provider } from '@nestjs/common';
import { LoginHandler } from '../commands/handler/login.command.handler';
import { ValidateTokenPayloadHandler } from '../commands/handler/validate-toke-payload.handler';

export const authCommandProviders: Provider[] = [
  LoginHandler,
  ValidateTokenPayloadHandler,
];
