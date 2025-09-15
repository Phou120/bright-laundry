import { Provider } from '@nestjs/common';
import { CreateHandler } from '../commands/handler/create-command.handler';
import { GetAllUserQueryHandler } from '../queries/handler/user-command.query';
import { GetOneUserQueryHandler } from '../queries/handler/get-one-query.handler';
import { UpdateHandler } from '../commands/handler/update-command.handler';
import { DeleteHandler } from '../commands/handler/delete.command.handler';
import { GetAllPermissionQueryHandler } from '../queries/handler/get-all-permission.handler';
import { GetOnePermissionQueryHandler } from '../queries/handler/get-one-permission.handler';
import { CreateRoleHandler } from '../commands/role/handler/create-command.handler';
import { GetAllRoleQueryHandler } from '../queries/role/handler/get-all-query.handler';
import { GetOneRoleQueryHandler } from '../queries/role/handler/get-one-query.handler';
import { UpdateRoleHandler } from '../commands/role/handler/update-command.handler';
import { DeleteRoleHandler } from '../commands/role/handler/delete-command.handler';
import { GetUserQueryHandler } from '../queries/handler/get-user-query.handler';
import { UploadHandler } from '../commands/handler/upload-command.handler';
import { UploadMultipleHandler } from '../commands/handler/upload-multiple-command.handler';
import { SendMailHandler } from '../commands/handler/send-mail-command.handler';
import { RegisterSuccessListener } from '../listeners/register-success.listener';
import { VerifyOtpHandler } from '../commands/handler/verify-otp-command.handler';
import { ResetPasswordHandler } from '../commands/handler/reset-password-command.handler';

export const commandProviders: Provider[] = [
  CreateHandler,
  GetAllUserQueryHandler,
  GetOneUserQueryHandler,
  UpdateHandler,
  DeleteHandler,
  GetAllPermissionQueryHandler,
  GetOnePermissionQueryHandler,
  CreateRoleHandler,
  GetAllRoleQueryHandler,
  GetOneRoleQueryHandler,
  UpdateRoleHandler,
  DeleteRoleHandler,
  GetUserQueryHandler,
  UploadHandler,
  UploadMultipleHandler,
  SendMailHandler,
  RegisterSuccessListener,
  VerifyOtpHandler,
  ResetPasswordHandler,
];
