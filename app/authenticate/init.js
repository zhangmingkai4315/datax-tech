const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models');
const authenticationMiddleware = require('./middleware');

function findUser(username, callback) {
  db
    .User
    .findOne({
      where: {
        username: username
      }
    })
    .then((user) => {
      if (user) {
        return callback(null, user);
      }
      return callback(null);
    });
}

passport.serializeUser((user, cb) => {
  cb(null, user.username);
});

passport.deserializeUser((username, cb) => {
  findUser(username, cb);
});

function initPassport() {
  passport.use(new LocalStrategy((username, password, done) => {
    findUser(username, (err, user) => {
      if (err) {
        return done(err)
      }
      if (!user) {
        return done(null, false);
      }
      bcrypt.compare(password, user.passwordHash, (error, isValid) => {
        if (error) {
          return done(error);
        }
        if (!isValid) {
          return done(null, false);
        }
        return done(null, user);
      });
    });
  }));
  passport.authenticationMiddleware = authenticationMiddleware;
}

module.exports = initPassport;
