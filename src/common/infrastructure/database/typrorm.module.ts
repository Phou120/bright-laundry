import { entities } from './index';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HelperSeeder } from './typeorms/seeders/helper.seeder';
import { UsersSeeder } from './typeorms/seeders/user.seed';
import { SeederService } from './typeorms/seeders/services/seeder.service';
import { TransactionModule } from '../transaction/transaction.module';
import { RoleSeeder } from './typeorms/seeders/role.seed';
import { PermissionGroupSeeder } from './typeorms/seeders/permission-group.seeder';
import { PermissionSeeder } from './typeorms/seeders/permission.seeder';
import { ProvinceSeeder } from './typeorms/seeders/province.seeder';
import { DistrictSeeder } from './typeorms/seeders/district.seeder';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TransactionModule,
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
  providers: [
    SeederService,
    HelperSeeder,
    RoleSeeder,
    UsersSeeder,
    PermissionGroupSeeder,
    PermissionSeeder,
    ProvinceSeeder,
    DistrictSeeder,
  ],
})
export class TypeOrmRepositoryModule {}
