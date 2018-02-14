/*!
 * datax-tech 网站源码
 * Copyright(c) 2017-2018 zhangmingkai4315(zhangmingkai.1989@gmail.com)
 * MIT Licensed
 */

/**
 * 模块依赖
 * @private
 */
const GithubStrategy = require("passport-github").Strategy;

/**
 * 变量声明
 * callbackURL  定义项目使用github认证后回调地址
 * db           保存实际数据库连接句柄
 * @private
 */
const callbackURL = `${process.env.DOMAIN}/auth/github/callback`;
const db = require("../../models");

/**
 * 定义github的策略处理函数
 * 根据实际的配置生成自定义的github认证策略对象
 *
 * @param  {}       无
 * @return {object} github策略对象
 */
exports.githubStrategyHandler = function() {
  return new GithubStrategy(
    {
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL,
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
      if (req.user) {
        db.User.findOne({
          where: {
            github_id: profile.id
          }
        }).then(user => {
          if (user) {
            req.flash("loginMessage", "用户已经存在,请使用该账户直接登入");
            done(null);
          } else {
            db.User.findById(req.user.id)
              .then(user => {
                if (user) {
                  user.github_id = parseInt(profile.id);
                  user.github_token = accessToken;
                  user.username = user.username || profile.username;
                  user.image_url = user.image_url || profile._json.avatar_url;
                  user.thunbnail_url =
                    user.thunbnail_url || profile._json.avatar_url;
                  user.globe_url = user.thunbnail_url || profile._json.blog;
                  user.github_url = user.github_url || profile.profileUrl;
                  return user.save();
                }
              })
              .then(user => {
                done(err, user);
              })
              .catch(err => {
                done(err, null);
              });
          }
        });
      } else {
        db.User.findOne({ github_id: profile.id })
          .then(user => {
            if (user) {
              return done(null, user);
            }
            db.User.findOne({ where: { email: profile._json.email } })
              .then(user => {
                if (user) {
                  req.flash(
                    "loginMessage",
                    "邮箱帐号已存在,请使用该github邮箱帐号直接登入"
                  );
                  done(err);
                } else {
                  console.log(profile);
                  db.User.create({
                    email: profile._json.email,
                    github_id: parseInt(profile.id),
                    github_token: accessToken,
                    username: profile.username,
                    globe_url: profile._json.blog,
                    image_url: profile._json.avatar_url,
                    thunbnail_url: profile._json.avatar_url,
                    github_url: profile.profileUrl
                  })
                    .then(user => {
                      done(null, user);
                    })
                    .catch(err => {
                      console.log(err);
                      done(err);
                    });
                }
              })
              .catch(err => done(err));
          })
          .catch(err => done(err));
      }
    }
  );
};
