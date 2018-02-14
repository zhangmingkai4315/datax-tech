/*!
 * datax-tech 网站源码
 * Copyright(c) 2017-2018 zhangmingkai4315(zhangmingkai.1989@gmail.com)
 * MIT Licensed
 */

/**
 * 模块依赖
 * @private
 */
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

/**
 * 变量声明
 * env       定义项目的运行环境
 * config    保存实际的运行环境配置
 * db        保存项目中的数据库handler,用于提供操作数据库的接口
 * sequelize 保存Sequelize实例
 * @private
 */
const env = process.env.ENV || "development";
const config = require("../../config/config")[env];
const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

/**
 * 导入models中的模型模块
 *
 * 所有保存在models文件夹中的文件(除了index.js外)都会
 * 自动导入到db中变为db的一个属性，并且执行associate方
 * 法进行关联绑定
 */
fs
  .readdirSync(__dirname)
  .filter(file => file.indexOf(".") !== 0 && file !== "index.js")
  .forEach(file => {
    const model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

/**
 * 模块导出声明
 * @public
 */
module.exports = db;
