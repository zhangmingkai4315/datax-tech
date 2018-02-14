/*!
 * datax-tech 网站源码
 * Copyright(c) 2017-2018 zhangmingkai4315(zhangmingkai.1989@gmail.com)
 * MIT Licensed
 */

/**
 * 模块依赖声明
 * @private
 */

const express = require("express");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const compress = require("compression");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const passport = require("passport");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const paginate = require("express-paginate");
const Uploader = require("jquery-file-upload-middleware");
const moment = require("moment");
// 设置中文国际化转换
moment.locale("zh-cn");

/**
 * 变量声明, 引入http的认证和主要api的处理模块
 * @private
 */

const authenticate = require("../app/controllers/authenticate");
const mainHandler = require("../app/controllers/main");
const authHandler = require("../app/controllers/auth");

/**
 * 初始化express应用,增加中间件配置并依据环境变量生成
 * 的config加载应用.
 * 缺省情况下运行与development开发模式
 *
 * @param {object} app
 * @param {object} config
 * @return {object} app(经过配置后的应用实例)
 */

module.exports = (app, config) => {
  const env = process.env.NODE_ENV || "development";
  const viewPath = `${config.root}/app/views`;
  const publicPath = `${config.root}/public`;
  const faviconPath = `${config.root}/public/img/icon/favicon.ico`;
  const uploadPath = `${config.root}/public/uploads/`;

  // 全局设置项目文件上传路径
  app.set("uploadPath", uploadPath);
  Uploader.configure({
    uploadDir: uploadPath,
    uploadUrl: "/uploads",
    imageVersions: {
      thumbnail: {
        width: 80,
        height: 80
      }
    }
  });

  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env === "development";

  app.set("views", viewPath);
  app.set("view engine", "ejs");

  app.use(favicon(faviconPath));
  app.use(logger("dev"));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(publicPath));
  app.use(methodOverride());

  // 加载local策略和github认证策略
  authenticate.init(app);

  // 设置Redis作为session的store,存储用户的会话信息
  app.use(
    session({
      store: new RedisStore({ url: config.redis }),
      secret: config.secrect,
      resave: false,
      saveUninitialized: false
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  app.use(paginate.middleware(10, 50));
  app.use("/auth", authHandler);
  app.use("/", mainHandler);

  app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  });

  if (app.get("env") === "development") {
    app.use((err, req, res) => {
      res.status(err.status || 500);
      res.render("error", {
        message: err.message,
        error: err,
        title: "error"
      });
    });
  }

  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: {},
      title: "error"
    });
  });

  return app;
};
