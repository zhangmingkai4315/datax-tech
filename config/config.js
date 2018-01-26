const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'datax-tech'
    },
    port: process.env.PORT || 3000,
    db: 'mysql://root:mysql@172.17.0.2/datax-tech-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'datax-tech'
    },
    port: process.env.PORT || 3000,
    db: 'mysql://root:mysql@172.17.0.2/datax-tech-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'datax-tech'
    },
    port: process.env.PORT || 3000,
    db: 'mysql://root:mysql@172.17.0.2/datax-tech-test'
  }
};

module.exports = config[env];
