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
import { TaxSeeder } from './typeorms/seeders/tax.seeder';
import { StoreStatusSeeder } from './typeorms/seeders/store-status.seeder';

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
        ssl: true, // Keep this as you previously fixed the TLS error

        // -----------------------------------------------------------------
        // *** NEW/ADJUSTED POOL CONFIGURATION ***
        // -----------------------------------------------------------------

        // Set a client-side timeout slightly higher than the DB default, if any
        connectTimeoutMS: 20000, // e.g., 20 seconds

        // Use the pool (required for TypeORM to manage connections)
        extra: {
          // Sets the client to send a TCP Keep-Alive probe (recommended for cloud connections)
          keepAlive: true,

          // Maximum time a connection can be idle in the pool before being closed (in ms).
          // If your DB has an aggressive idle timeout, set this lower.
          idleTimeoutMillis: 30000, // e.g., 30 seconds

          // Time in milliseconds to wait before a query is considered a timeout
          query_timeout: 10000, // e.g., 10 seconds
        },

        // Maximum number of connections to allow in the pool. Default is 10.
        // If you are using a tiny DB instance, you may need to lower this.
        max: 10,
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
        ssl: true, // Keep this as you previously fixed the TLS error

        // -----------------------------------------------------------------
        // *** NEW/ADJUSTED POOL CONFIGURATION ***
        // -----------------------------------------------------------------

        // Set a client-side timeout slightly higher than the DB default, if any
        connectTimeoutMS: 20000, // e.g., 20 seconds

        // Use the pool (required for TypeORM to manage connections)
        extra: {
          // Sets the client to send a TCP Keep-Alive probe (recommended for cloud connections)
          keepAlive: true,

          // Maximum time a connection can be idle in the pool before being closed (in ms).
          // If your DB has an aggressive idle timeout, set this lower.
          idleTimeoutMillis: 30000, // e.g., 30 seconds

          // Time in milliseconds to wait before a query is considered a timeout
          query_timeout: 10000, // e.g., 10 seconds
        },

        // Maximum number of connections to allow in the pool. Default is 10.
        // If you are using a tiny DB instance, you may need to lower this.
        max: 10,
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
    TaxSeeder,
    StoreStatusSeeder,
  ],
})
export class TypeOrmRepositoryModule {}

//
