/*!
 * datax-tech 网站源码
 * Copyright(c) 2017-2018 zhangmingkai4315(zhangmingkai.1989@gmail.com)
 * MIT Licensed
 */

/**
 * 模块依赖
 * @private
 */
const redis = require("redis");
const bluebird = require("bluebird");

/**
 * 变量声明
 * env       定义项目的运行环境
 * config    保存实际的运行环境配置
 * client    保存redis连接客户端
 * @private
 */
const env = process.env.ENV || "development";
const config = require("../../config/config")[env];
const client = redis.createClient(config.redis);

// 通过使用bluebird来将redis的回调函数转换为promise模式
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

/**
 * 模块导出声明
 * @public
 */
module.exports = client;
