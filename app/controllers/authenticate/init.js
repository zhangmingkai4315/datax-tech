const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const db = require("../../models");
const authenticationMiddleware = require("../middleware");
const {body, validationResult} = require("express-validator/check");
const {sanitizeBody} = require("express-validator/filter");

function signUpValidation() {
  // Validate fields.
  body("username")
    .isLength({min: 5})
    .withMessage("长度不能为空，且不能小于5位");
  body("email")
    .isEmail()
    .withMessage("输入Email格式错误");
  body("passwprd")
    .isLength({min: 6})
    .withMessage("密码长度不能为空，且不小于6位");
  sanitizeBody("username")
    .trim()
    .escape();
  sanitizeBody("email")
    .trim()
    .escape();
  sanitizeBody("password")
    .trim()
    .escape();
}

function findUser(email, callback) {
  db
    .User
    .findOne({where: {
        email
      }})
    .then((user) => {
      if (user) {
        return callback(null, user);
      }
      return callback(null);
    })
    .catch(err => callback(null, err));
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db
    .User
    .findById(id)
    .then((user) => {
      if (user) {
        return done(null, user);
      }
      return done(null, null);
    })
    .catch(() => done(null, false));
});

function initPassport() {
  passport.use("local-signup", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
  }, (req, email, password, done) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return done(null, false, req.flash("signupMessage", errors.array()[0]));
    }
    return findUser(email, (err, user) => {
      if (err) {
        return done(err);
      }
      if (user) {
        return done(null, false, req.flash("signupMessage", "邮箱地址已被占用"));
      }
      const newUser = db
        .User
        .build({email, username: req.body.username, password});
      return newUser
        .generateHash(password)
        .then((p) => {
          newUser.password = p;
          return newUser.save();
        })
        .then(u => done(null, u))
        .catch(() => done(null, false, req.flash("signupMessage", "服务暂时不可用，请稍后")));
    });
  }));

  passport.use("local-login", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
  }, (req, email, password, done) => {
    findUser(email, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, req.flash("signupMessage", "邮箱账号不存在，请重新输入"));
      }
      return user
        .validPassword(password)
        .then((result) => {
          if (result === false) {
            return done(null, false, req.flash("loginMessage", "用户名或密码不正确"));
          }
          return done(null, user);
        })
        .catch(() => done(null, false, req.flash("loginMessage", "服务暂时不可用，请稍后")));
    });
  }));
  passport.authenticationMiddleware = authenticationMiddleware;
}

module.exports = initPassport;
