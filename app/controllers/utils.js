/*!
 * datax-tech 网站源码
 * Copyright(c) 2017-2018 zhangmingkai4315(zhangmingkai.1989@gmail.com)
 * MIT Licensed
 */

const errors = require("./errors");

/**
 * 获取所有obj的方法名称
 *
 * @param {object} obj 被检查的对象参数
 * @return {array}
 */
exports.getMethods = function(obj) {
  const ret = [];
  for (let prop in obj) {
    if (
      obj[prop] &&
      obj[prop].constructor &&
      obj[prop].call &&
      obj[prop].apply
    ) {
      ret.push(prop);
    }
  }
  return ret;
};

/**
 * 根据输入的数据类型返回用户特定的响应数据
 *
 * 如果输入的为CustomError对象,获取其中的状态码及信息
 * 如果输入的为普通Error对象，则返回500状态码
 * 其他的输入对象obj，一律按照 {data:obj}格式返回
 *
 * @param {object} response 待返回的数据对象
 * @param {object} res express.res对象
 * @return {}
 */
exports.renderJSON = function(response, res) {
  if (response instanceof errors.CustomError) {
    res.status(response.Code).json({
      error: response.name,
      message: response.message
    });
    return;
  }
  if (response instanceof Error) {
    res.status(500).json({ error: response });
    return;
  }
  res.json({ data: response });
};

/**
 * 根据输入的错误数据类型返回用户特定的响应视图
 *
 * 如果输入的为CustomError对象,获取其中的状态码返回特定视图
 * 如果输入的为普通Error对象，则返回500视图
 *
 * @param {object} response 待返回的数据对象
 * @param {object} res express.res对象
 * @return {}
 */

exports.renderErrorView = function(response, res) {
  if (response instanceof errors.CustomError) {
    const code = response.code;
    res.status(code).render(`common/${code}`, { title: `Error ${code}` });
    return;
  }
  if (response instanceof Error) {
    res.status(500).render(`common/500`, { title: `Error 500` });
    return;
  }
};
