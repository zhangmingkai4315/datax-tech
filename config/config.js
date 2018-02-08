const path = require("path");

const rootPath = path.normalize(`${__dirname}/..`);
const dotenv = require("dotenv");
dotenv.load();
const config = {
  development: {
    root: rootPath,
    http_domain: process.env.DOMAIN,
    http_port: process.env.PORT,
    app: {
      name: process.env.APP
    },
    secrect: process.env.SECRECT,

    username: process.env.MYSQL_DB_USERNAME_DEV,
    password: process.env.MYSQL_DB_PASSWORD_DEV,
    database: process.env.MYSQL_DB_DATABASE_DEV,
    host: process.env.MYSQL_DB_HOST_DEV,

    port: process.env.MYSQL_DB_PORT_DEV,
    dialect: "mysql",

    redis: process.env.REDIS_DB_DEV
  },
  test: {
    root: rootPath,
    http_domain: process.env.DOMAIN,
    http_port: process.env.PORT,
    app: {
      name: process.env.APP
    },
    secrect: process.env.SECRECT,
    username: process.env.MYSQL_DB_USERNAME_TEST,
    password: process.env.MYSQL_DB_PASSWORD_TEST,
    database: process.env.MYSQL_DB_DATABASE_TEST,
    host: process.env.MYSQL_DB_HOST_TEST,
    port: process.env.MYSQL_DB_PORT_TEST,
    dialect: "mysql",

    redis: process.env.REDIS_DB_TEST
  },
  production: {
    root: rootPath,
    http_domain: process.env.DOMAIN,
    http_port: process.env.PORT,
    app: {
      name: process.env.APP
    },
    secrect: process.env.SECRECT,

    username: process.env.MYSQL_DB_USERNAME,
    password: process.env.MYSQL_DB_PASSWORD,
    database: process.env.MYSQL_DB_DATABASE,
    host: process.env.MYSQL_DB_HOST,
    port: process.env.MYSQL_DB_PORT,
    dialect: "mysql",

    redis: process.env.REDIS_DB
  }
};
module.exports = config;
