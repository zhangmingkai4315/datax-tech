const express = require("express");

const auth = new express.Router();
const v1Router = require("./v1");

auth.use("/", v1Router);

module.exports = auth;
