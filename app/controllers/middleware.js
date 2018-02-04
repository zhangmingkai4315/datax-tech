const _ = require("lodash");

const authenticationMiddle = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/auth/login");
};
const customRenderMiddleware = (req, res, next) => {
  const oldRender = res.render;
  res.render = function (view, options, fn) {
    _.extend(options, {
      title: "datax",
      current_user: req.user || ""
    });
    oldRender.call(this, view, options, fn);
  };
  return next();
};
module.exports = {
  authenticationMiddle,
  customRenderMiddleware
};
