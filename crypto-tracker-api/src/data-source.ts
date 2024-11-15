import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.POSTGRES_URI,
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
  migrationsRun: true,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
