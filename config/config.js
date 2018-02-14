/*!
 * datax-tech 网站源码
 * Copyright(c) 2017-2018 zhangmingkai4315(zhangmingkai.1989@gmail.com)
 * MIT Licensed
 */

/**
 * 模块依赖
 * @private
 */

const path = require("path");
const dotenv = require("dotenv");

/**
 * 变量
 * rootPath:变量定义项目根目录
 * @private
 */
const rootPath = path.normalize(`${__dirname}/..`);

// 导入.env文件中的变量到系统环境变量中
dotenv.load();

/**
 * 保存所有不同环境下配置参数的实例对象,通过实际环境config[env]访问
 * @private
 */
module.exports = {
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
