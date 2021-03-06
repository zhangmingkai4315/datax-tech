/*!
 * datax-tech 网站源码
 * Copyright(c) 2017-2018 zhangmingkai4315(zhangmingkai.1989@gmail.com)
 * MIT Licensed
 */

/**
 * 模块依赖
 * @private
 */
const express = require("express");
const passport = require("passport");

/**
 * 变量声明
 * @private
 */
const auth = new express.Router();

auth.get("/login", (req, res) => {
  res.render("auth/login", {
    title: "用户登入",
    message: req.flash("loginMessage")
  });
});
auth.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/profile", // redirect to the secure profile section
    failureRedirect: "/auth/login", // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  })
);

auth.get("/signup", (req, res) => {
  res.render("auth/signup", {
    title: "注册用户",
    message: req.flash("signupMessage")
  });
});
auth.post(
  "/signup",
  passport.authenticate("local-signup", {
    successRedirect: "/profile", // redirect to the secure profile section
    failureRedirect: "/auth/signup", // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  })
);

auth.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// 定义github的路由处理
auth.get("/github", passport.authenticate("github"));
// 定义github的路由回调处理
auth.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    successRedirect: "/profile"
  })
);

/**
 * 模块导出声明
 * @public
 */
module.exports = auth;
