import { config } from 'dotenv';
import { isString } from 'lodash';

config();

type Config = {
  db: {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    database?: string;
  };
};

const envDbPort = process.env.DB_PORT;

export const configuration: Config = {
  db: {
    host: process.env.DB_HOST,
    port: isString(envDbPort) ? parseInt(envDbPort, 10) : undefined,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
};

export const configurationFunction = () => configuration;
