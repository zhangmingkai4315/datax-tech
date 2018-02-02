const middleware = require("../../authenticate/middleware");

module.exports = (app, passport) => {
  app.get("/", (req, res) => {
    res.render("index", {title: "DataX"});
  });
  app.get("/login", (req, res) => {
    res.render("auth/login", {
      title: "用户登入",
      message: req.flash("loginMessage")
    });
  });
  app.post("/login", passport.authenticate("local-login", {
    successRedirect: "/profile", // redirect to the secure profile section
    failureRedirect: "/login", // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  app.get("/signup", (req, res) => {
    res.render("auth/signup", {
      title: "注册用户",
      message: req.flash("signupMessage")
    });
  });
  app.post("/signup", passport.authenticate("local-signup", {
    successRedirect: "/profile", // redirect to the secure profile section
    failureRedirect: "/signup", // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  app.get("/profile", middleware.authenticationMiddle, (req, res) => {
    res.redirect(`/user/${req.user.username}`);
  });
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });
};
