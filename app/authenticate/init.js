const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models');
const authenticationMiddleware = require('./middleware');

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
    });
}

passport.serializeUser((user, cb) => {
  cb(null, user.email);
});

passport.deserializeUser((email, cb) => {
  findUser(email, cb);
});

function initPassport() {
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, email, password, done) => {
    findUser(email, (err, user) => {
      if (err) {
        return done(err);
      }
      if (user) {
        return done(null, false, req.flash('signupMessage', '邮箱地址已被占用'));
      }
      const newUser = db
        .User
        .build({email, password});
      return newUser
        .generateHash(password)
        .then((p) => {
          newUser.password = p;
          return newUser.save();
        })
        .then(u => done(null, u))
        .catch(() => done(null, false, req.flash('signupMessage', '服务暂时不可用，请稍后')));
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, email, password, done) => {
    findUser(email, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, req.flash('signupMessage', '邮箱账号不存在，请重新输入'));
      }
      user
        .validPassword(password)
        .then((result) => {
          if (result === false) {
            return done(null, false, req.flash('loginMessage', '用户名或密码不正确'));
          }
          return done(null, user);
        })
        .catch(() => done(null, false, req.flash('loginMessage', '服务暂时不可用，请稍后')));
    });
  }));
  passport.authenticationMiddleware = authenticationMiddleware;
}

module.exports = initPassport;
