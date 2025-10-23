import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { entities } from './index';

config(); // ໂຫຼດຈາກ .env
export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.WRITE_DB_HOST || 'localhost',
  port: Number(process.env.WRITE_DB_PORT) || 5432,
  username: process.env.WRITE_DB_USERNAME || '',
  password: process.env.WRITE_DB_PASSWORD || '',
  database: process.env.WRITE_DB_NAME || 'bright_laundry',
  synchronize: Boolean(process.env.WRITE_DB_SYNCHRONIZE) || false,
  logging: Boolean(process.env.WRITE_DB_LOGGING || false),
  entities: [...entities],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  migrationsTableName: 'migrations', // Set a client-side timeout slightly higher than the DB default, if any
  connectTimeoutMS: 20000, // e.g., 20 seconds
  // -----------------------------------------------------------------
  // *** CORRECTED 'extra' CONFIGURATION ***
  // -----------------------------------------------------------------

  extra: {
    // Sets the client to send a TCP Keep-Alive probe (recommended for cloud connections)
    keepAlive: true,

    idleTimeoutMillis: 30000, // e.g., 30 seconds
    query_timeout: 10000, // e.g., 10 seconds
    // FIX: SSL configuration for the 'pg' driver to resolve TLS errors
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
