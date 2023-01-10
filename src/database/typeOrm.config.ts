import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { configuration } from '../config/configuration';

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configuration.db.host,
  port: configuration.db.port,
  username: configuration.db.username,
  password: configuration.db.password,
  database: configuration.db.database,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],
  migrationsTableName: 'migrations_history',
};

export const typeOrmConfig: TypeOrmModuleOptions = {
  ...dataSourceOptions,
};

export const dataSourceConfig = new DataSource(dataSourceOptions);
