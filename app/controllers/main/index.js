/*!
 * datax-tech 网站源码
 * Copyright(c) 2017-2018 zhangmingkai4315(zhangmingkai.1989@gmail.com)
 * MIT Licensed
 */

const express = require("express");

const main = new express.Router();
const v1Router = require("./v1");

main.use("/", v1Router);
module.exports = main;
