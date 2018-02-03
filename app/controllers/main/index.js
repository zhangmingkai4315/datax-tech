const express = require("express");

const main = new express.Router();
const v1Router = require("./v1");

main.use("/", v1Router);
module.exports = main;
