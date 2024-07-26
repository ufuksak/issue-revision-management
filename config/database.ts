// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  development: {
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    username: process.env.MYSQLDB_USER,
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    password: process.env.MYSQLDB_ROOT_PASSWORD,
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    database: process.env.MYSQLDB_DATABASE,
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    host: process.env.DB_HOST,
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    dialect: process.env.DB_DIALECT || "mysql",
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    port: process.env.MYSQLDB_LOCAL_PORT,
    pool: {
      max: 10,
      min: 0,
    },
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  },
};
