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

/**
 * 变量声明
 * @private
 */
const v1 = new express.Router();
const users = require("./users");
const articles = require("./articles");
const skills = require("./skills");
const tags = require("./tags");
const comments = require("./comments");
const middleware = require("../../middleware");

v1.use(middleware.customRenderMiddleware);
v1.get("/", (req, res) => {
  res.render("index", {
    title: "DataX",
    current_user: req.user
  });
});
v1.get("/profile", middleware.authenticationMiddle, (req, res) => {
  res.redirect(`/users/${req.user.username}`);
});
v1.get("/users/:username", users.getUserProfile);
v1.get("/users/:id/stats", middleware.cache(60), users.getUserStats);
v1.get(
  "/users/:username/edit",
  middleware.authenticationMiddle,
  users.editUserProfile
);

v1.post(
  "/user/profile/basic",
  middleware.authenticationMiddle,
  users.editUserProfileBasic
);
v1.get("/user/skills", middleware.authenticationMiddle, users.getUserSkills);
v1.post("/user/links", middleware.authenticationMiddle, users.createUserLinks);
v1.post("/user/skill", middleware.authenticationMiddle, users.createUserSkill);
v1.use(
  "/user/upload/profileimg",
  middleware.authenticationMiddle,
  users.uploadUserProfileImg
);

v1.post("/article/like", middleware.authenticationMiddle, articles.likeArticle);
v1.post(
  "/article/collection",
  middleware.authenticationMiddle,
  articles.collectionArticle
);
v1.get(
  "/articles/new",
  middleware.authenticationMiddle,
  articles.createArticleView
);
v1.get("/articles/stats", middleware.cache(60), articles.getArticlesStats);
v1.post(
  "/article/uploadcoverimg",
  middleware.authenticationMiddle,
  articles.uploadCoverImg
);
v1.get("/articles/:id", articles.getArticleById);
v1.delete("/articles/:id", articles.deleteArticleById);
v1.get(
  "/articles/:id/edit",
  middleware.authenticationMiddle,
  articles.editAticleView
);

v1.post(
  "/articles/:id/edit",
  middleware.authenticationMiddle,
  articles.editAticlePost
);

v1.get("/articles", articles.getArticles);
v1.post("/articles", middleware.authenticationMiddle, articles.createArticle);

v1.get("/skills", skills.getSkills);
v1.post("/skills", skills.createSkills);

v1.get("/tags", tags.getTags);
v1.post("/tags", tags.createTag);

v1.post("/comments", middleware.authenticationMiddle, comments.createComment);
v1.delete("/comments", middleware.authenticationMiddle, comments.deleteComment);

module.exports = v1;
