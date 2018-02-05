const express = require("express");
// const glob = require("glob");

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
moment.locale("zh-cn");

const authenticate = require("../app/controllers/authenticate");

const mainHandler = require("../app/controllers/main");
const authHandler = require("../app/controllers/auth");

module.exports = (app, config) => {
  const env = process.env.NODE_ENV || "development";
  const viewPath = `${config.root}/app/views`;
  const publicPath = `${config.root}/public`;
  const faviconPath = `${config.root}/public/img/icon/favicon.ico`;
  const uploadPath = `${config.root}/public/uploads/`;
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
  authenticate.init(app);

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
