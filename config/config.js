const path = require("path");

const rootPath = path.normalize(`${__dirname}/..`);
const env = process.env.ENV || "app";
const config = {
  app: {
    root: rootPath,
    domain: process.env.DOMAIN,
    app: {
      name: process.env.APP
    },
    secrect: process.env.SECRECT,
    port: process.env.PORT,
    db: process.env.MYSQL_DB,
    redis: process.env.REDIS_DB
  },
  test: {
    root: rootPath,
    domain: process.env.DOMAIN,
    app: {
      name: process.env.APP
    },
    secrect: process.env.SECRECT,
    port: process.env.PORT,
    db: process.env.MYSQL_DB_TEST,
    redis: process.env.REDIS_DB_TEST
  }
};

module.exports = config[env];
