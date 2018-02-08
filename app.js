const express = require("express");

const env = process.env.ENV || "development";
const config = require("./config/config")[env];

const db = require("./app/models");
const app = express();

module.exports = require("./config/express")(app, config);

db.sequelize
  .sync()
  .then(() => {
    if (!module.parent) {
      app.listen(config.http_port, () => {
        console.log(`Express server listening on port ${config.http_port}`);
      });
    }
  })
  .catch(e => {
    throw new Error(e);
  });
