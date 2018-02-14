/*!
 * datax-tech 网站源码
 * Copyright(c) 2017-2018 zhangmingkai4315(zhangmingkai.1989@gmail.com)
 * MIT Licensed
 */

/**
 * 通用的自定义错误构造函数
 *
 * 用于生成带有http语义的自定义的错误
 * @constructor
 * @param message 错误信息的名称
 * @param code    错误的代码名称
 * @param options 其他的附加对象内容
 *
 */
function CustomError(message, code, options) {
  Error.captureStackTrace(this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.code = code;
  this.options = options;
}

/**
 * 定义资源找不到时返回的错误
 * @param {object}  options 附加信息
 * @return {object} 实际的错误对象
 */
const NotFoundError = options =>
  new CustomError("Resouce Not Found", 404, options);

/**
 * 定义服务操作失败时返回的错误
 * @param {object}  options 附加信息
 * @return {object} 实际的错误对象
 */
const ServerFailError = options =>
  new CustomError("Server Not Response", 500, options);

/**
 * 定义客户端数据错误时返回的错误
 * @param {object}  options 附加信息
 * @return {object} 实际的错误对象
 */
const BadRequestError = options =>
  new CustomError("Request Not Correct", 400, options);

/**
 * 定义权限认证失败时返回的错误
 * @param {object}  options 附加信息
 * @return {object} 实际的错误对象
 */
const ForbiddenError = options =>
  new CustomError("Resouce Access Not Allow", 403, options);

/**
 * 模块导出声明
 * @public
 */
module.exports = {
  CustomError,
  NotFoundError,
  ServerFailError,
  BadRequestError,
  ForbiddenError
};
