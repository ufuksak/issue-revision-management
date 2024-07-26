const { Sequelize } = require("sequelize");
const config = require("../../config/database");
const IssueModel = require("./issue");
const RevisionModel = require("./revision");

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

let sequelize;
if (env === "test") {
  sequelize = new Sequelize(dbConfig);
} else {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig
  );
}

const Issue = IssueModel(sequelize);
const Revision = RevisionModel(sequelize);

module.exports = {
  sequelize,
  Issue,
  Revision,
};
