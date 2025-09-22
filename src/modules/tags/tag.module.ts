import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TagController } from './controllers/tag.controller';
import { tagProvider } from './providers';

@Module({
  imports: [CqrsModule],
  controllers: [TagController],
  providers: [...tagProvider],
  exports: [...tagProvider],
})
export class TagModule {}
