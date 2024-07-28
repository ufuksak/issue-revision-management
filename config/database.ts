import { Dialect } from 'sequelize';

interface Config {
  username?: string | undefined;
  password?: string | undefined;
  database?: string | undefined;
  host?: string | undefined;
  dialect: Dialect;
  port?: string | undefined;
  pool?: {
    max: number;
    min: number;
  };
  storage?: string;
  logging?: boolean;
}

const config: { [key: string]: Config } = {
  development: {
    username: process.env.MYSQLDB_USER,
    password: process.env.MYSQLDB_ROOT_PASSWORD,
    database: process.env.MYSQLDB_DATABASE,
    host: process.env.DB_HOST,
    dialect: (process.env.DB_DIALECT || "mysql") as Dialect,
    port: process.env.MYSQLDB_DOCKER_PORT,
    pool: {
      max: 10,
      min: 0,
    }
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:",
    logging: false
  },
};

export default config;
