const express = require("express");
const passport = require("passport");

const auth = new express.Router();

auth.get("/login", (req, res) => {
  res.render("auth/login", {
    title: "用户登入",
    message: req.flash("loginMessage")
  });
});
auth.post("/login", passport.authenticate("local-login", {
  successRedirect: "/profile", // redirect to the secure profile section
  failureRedirect: "/auth/login", // redirect back to the signup page if there is an error
  failureFlash: true // allow flash messages
}));

auth.get("/signup", (req, res) => {
  res.render("auth/signup", {
    title: "注册用户",
    message: req.flash("signupMessage")
  });
});
auth.post("/signup", passport.authenticate("local-signup", {
  successRedirect: "/profile", // redirect to the secure profile section
  failureRedirect: "/auth/signup", // redirect back to the signup page if there is an error
  failureFlash: true // allow flash messages
}));

auth.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = auth;
