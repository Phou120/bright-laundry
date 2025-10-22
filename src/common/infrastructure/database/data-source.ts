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
  migrationsTableName: 'migrations', // -----------------------------------------------------------------
  // REMOVED: ssl: true, (It conflicts with the extra config below)
  // -----------------------------------------------------------------
  // Set a client-side timeout slightly higher than the DB default, if any
  connectTimeoutMS: 20000, // e.g., 20 seconds
  // Maximum number of connections to allow in the pool. Default is 10.
  // If you are using a tiny DB instance, you may need to lower this.
  // max: 10, // You can leave this commented out or uncomment if needed
  // -----------------------------------------------------------------
  // *** CORRECTED 'extra' CONFIGURATION ***
  // -----------------------------------------------------------------

  extra: {
    // Sets the client to send a TCP Keep-Alive probe (recommended for cloud connections)
    keepAlive: true, // Maximum time a connection can be idle in the pool before being closed (in ms).

    idleTimeoutMillis: 30000, // e.g., 30 seconds
    // Time in milliseconds to wait before a query is considered a timeout

    query_timeout: 10000, // e.g., 10 seconds
    // FIX: SSL configuration for the 'pg' driver to resolve TLS errors

    ssl: {
      rejectUnauthorized: false,
    },
  },
});
