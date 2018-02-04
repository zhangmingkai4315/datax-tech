const express = require("express");

const v1 = new express.Router();
const users = require("./users");
const articles = require("./articles");
const skills = require("./skills");
const comments = require("./comments");
const middleware = require("../../../authenticate/middleware");

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
v1.get("/users/:username/edit", middleware.authenticationMiddle, users.editUserProfile);

v1.post("/user/profile/basic", middleware.authenticationMiddle, users.editUserProfileBasic);
v1.get("/user/skills", middleware.authenticationMiddle, users.getUserSkills);
v1.post("/user/links", middleware.authenticationMiddle, users.createUserLinks);
v1.post("/user/skill", middleware.authenticationMiddle, users.createUserSkill);
v1.use("/user/upload/profileimg", middleware.authenticationMiddle, users.uploadUserProfileImg);

v1.get("/articles/new", middleware.authenticationMiddle, articles.createArticleView);
v1.post("/article/uploadcoverimg", middleware.authenticationMiddle, articles.uploadCoverImg);
v1.get("/articles/:id", articles.getArticle);
v1.post("/articles", middleware.authenticationMiddle, articles.createArticle);

v1.get("/skills", skills.getSkills);
v1.post("/skills", skills.createSkills);

v1.post("/comments", middleware.authenticationMiddle, comments.createComment);
v1.delete("/comments", middleware.authenticationMiddle, comments.deleteComment);

module.exports = v1;
