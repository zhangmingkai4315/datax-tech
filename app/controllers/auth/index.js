/*!
 * datax-tech 网站源码
 * Copyright(c) 2017-2018 zhangmingkai4315(zhangmingkai.1989@gmail.com)
 * MIT Licensed
 */

const express = require("express");

const auth = new express.Router();
const v1Router = require("./v1");

auth.use("/", v1Router);

/**
 * 模块导出声明
 * @public
 */
module.exports = auth;
