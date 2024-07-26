// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { Sequelize } = require("sequelize");
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const config = require("../../config/database");
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const IssueModel = require("./issue");
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const RevisionModel = require("./revision");

// @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sequelize'... Remove this comment to see the full error message
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

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Issue'.
const Issue = IssueModel(sequelize);
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Revision'.
const Revision = RevisionModel(sequelize);

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  sequelize,
  Issue,
  Revision,
};
