import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { AuthModule } from './users/auth/auth.module';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class IndexModule {}
