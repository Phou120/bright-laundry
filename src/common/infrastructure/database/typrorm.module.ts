import { entities } from './index';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      name: process.env.WRITE_CONNECTION_NAME,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('WRITE_DB_HOST'),
        port: configService.getOrThrow<number>('WRITE_DB_PORT'),
        username: configService.getOrThrow<string>('WRITE_DB_USERNAME'),
        password: configService.getOrThrow<string>('WRITE_DB_PASSWORD'),
        database: configService.getOrThrow<string>('WRITE_DB_NAME'),
        entities: [...entities],
        subscribers: [],
        synchronize:
          configService.getOrThrow<never>('WRITE_DB_SYNCHRONIZE') == 'true', // set false because i need use migrations
        logging: configService.getOrThrow<boolean>('WRITE_DB_LOGGING'),
        migrationsTableName: 'migrations',
      }),
    }),
    TypeOrmModule.forRootAsync({
      name: process.env.READ_CONNECTION_NAME,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('READ_DB_HOST'),
        port: configService.getOrThrow<number>('READ_DB_PORT'),
        username: configService.getOrThrow<string>('READ_DB_USERNAME'),
        password: configService.getOrThrow<string>('READ_DB_PASSWORD'),
        database: configService.getOrThrow<string>('READ_DB_NAME'),
        entities: [...entities],
        subscribers: [],
        synchronize:
          configService.getOrThrow<never>('READ_DB_SYNCHRONIZE') == 'true', // set false because i need use migrations
        logging: configService.getOrThrow<boolean>('READ_DB_LOGGING'),
        migrationsTableName: 'migrations',
      }),
    }),
    TypeOrmModule.forFeature([...entities]), // ຖ້າບໍ່ໃຊ້ອັນນີ້ຈະບໍ່ສາມາດເອີ້ນໃຊ້ Repository<User>
  ],
  exports: [TypeOrmModule],
  providers: [],
})
export class TypeOrmRepositoryModule {}
