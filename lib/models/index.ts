import {Options, Sequelize} from "sequelize";
import dotenv from "dotenv";
import config from "../../config/database";
import IssueModel from "./issue";
import RevisionModel from "./revision";

dotenv.config();

let env: string = process.env.NODE_ENV || "development";
const dbConfig = config[env] as Options;

let sequelize: Sequelize;
if (env === "test") {
  sequelize = new Sequelize(dbConfig);
} else {
  sequelize = new Sequelize(
      dbConfig.database!,
      dbConfig.username!,
      dbConfig.password!,
      dbConfig
  );
}

const Issue = IssueModel(sequelize);
const Revision = RevisionModel(sequelize);

export {
  sequelize,
  Issue,
  Revision,
};


