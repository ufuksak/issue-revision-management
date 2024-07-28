import {Sequelize} from "sequelize-typescript";
import {Options} from "sequelize";
import dotenv from "dotenv";
import config from "../../config/database";
import {Issue} from "./issuenew";
import {Revision} from "./revisionnew";

dotenv.config();

let env: string = process.env.NODE_ENV || "development";
const dbConfig = config[env] as Options;

let sequelize: Sequelize;
if (env === "test") {
  sequelize = new Sequelize(dbConfig);
  sequelize.addModels([Issue, Revision]);
} else {
  sequelize = new Sequelize(
      dbConfig.database!,
      dbConfig.username!,
      dbConfig.password!,
      dbConfig
  );
  sequelize.addModels([Issue, Revision]);
}

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync all defined models to the DB
    await sequelize.sync();
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

initializeDatabase();

export {
  sequelize,
  Issue,
  Revision,
};
