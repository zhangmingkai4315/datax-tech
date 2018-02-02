const path = require("path");

const rootPath = path.normalize(`${__dirname}/..`);
const env = process.env.NODE_ENV || "development";

const config = {
  development: {
    root: rootPath,
    app: {
      name: "datax-tech"
    },
    secrect: "DEVELOPSECRECT",
    port: process.env.PORT || 3000,
    db: "mysql://root:mysql@127.0.0.1/datax-tech-development",
    redis: "redis://127.0.0.1:6379"
  },

  test: {
    root: rootPath,
    app: {
      name: "datax-tech"
    },
    secrect: "DEVELOPSECRECT",
    port: process.env.PORT || 3000,
    db: "mysql://root:mysql@127.0.0.1/datax-tech-test",
    redis: "redis://127.0.0.1:6379"
  },

  production: {
    root: rootPath,
    app: {
      name: "datax-tech"
    },
    secrect: "DEVELOPSECRECT",
    port: process.env.PORT || 3000,
    db: "mysql://root:mysql@127.0.0.1/datax-tech-test",
    redis: "redis://127.0.0.1:6379"
  }
};

module.exports = config[env];
