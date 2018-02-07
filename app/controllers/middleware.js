const _ = require("lodash");

const redisClient = require("./redis-cli");
// 定义路由认证的中间件
const authenticationMiddle = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/auth/login");
};
// 绑定一些常用的模板参数
const customRenderMiddleware = (req, res, next) => {
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

// 定义处理的缓存时间
const cache = duration => async (req, res, next) => {
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

module.exports = {
  authenticationMiddle,
  customRenderMiddleware,
  cache
};
