import { config } from 'dotenv';
import { isString } from 'lodash';

config();

type Config = {
  db: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
};

const envDbPort = process.env.DB_PORT;

export const configuration: Config = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: isString(envDbPort) ? parseInt(envDbPort, 10) : 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'scheduler',
  },
};

export const configurationFunction = () => configuration;
