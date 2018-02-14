/*!
 * datax-tech 网站源码
 * Copyright(c) 2017-2018 zhangmingkai4315(zhangmingkai.1989@gmail.com)
 * MIT Licensed
 */

/**
 * 模块依赖
 * @private
 */
const _ = require("lodash");

/**
 * 变量声明
 * @private
 */
const redisClient = require("./redis-cli");

/**
 * 定义认证中间件
 *
 * 当用户为非认证用户是将用户自动跳转到登入页面
 *
 * @param {object} req  express.req对象
 * @param {object} res  express.res对象
 * @param {object} next 中间件的next回调函数
 * @return
 */
exports.authenticationMiddle = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/auth/login");
};

/**
 * 定义自定义render方法的中间件
 *
 * 修改当前访问对象res.render方法，自动增加一些特殊的属性
 * 或方法
 *
 * @param {object} req  express.req对象
 * @param {object} res  express.res对象
 * @param {object} next 中间件的next回调函数
 * @return
 */
exports.customRenderMiddleware = function(req, res, next) {
  const oldRender = res.render;
  res.render = function(view, options, fn) {
    _.extend(options, {
      title: "datax",
      current_user: req.user || ""
    });
    oldRender.call(this, view, options, fn);
  };
  return next();
};

/**
 * 定义缓存数据中间件
 *
 * 针对用户的url进行缓存
 * 当用户访问的连接命中缓存则直接从缓存中获取数据
 * 当前缓存后端存储为redis保存数据
 *
 * @param {number} duration  缓存的有效期(单位秒)
 * @param {function} 返回一个中间件函数
 * @return
 */
exports.cache = function(duration) {
  return async function(req, res, next) {
    let key = "__datax__" + req.originalUrl || req.url;
    let cachedBody = await redisClient.getAsync(key);
    if (cachedBody) {
      res.send(cachedBody);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = body => {
        redisClient.set(key, body, "EX", duration, err => {
          if (err) {
            console.log(err);
          }
          res.sendResponse(body);
        });
      };
      next();
    }
  };
};
