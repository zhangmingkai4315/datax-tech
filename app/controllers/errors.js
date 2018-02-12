function CustomError(message, code, options) {
  Error.captureStackTrace(this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.code = code;
  this.options = options;
}

// 自定义HTTP错误
const NotFoundError = options =>
  new CustomError("Resouce Not Found", 404, options);
const ServerFailError = options =>
  new CustomError("Server Not Response", 500, options);
const BadRequestError = options =>
  new CustomError("Request Not Correct", 400, options);
const ForbiddenError = options =>
  new CustomError("Resouce Access Not Allow", 403, options);

module.exports = {
  CustomError,
  NotFoundError,
  ServerFailError,
  BadRequestError,
  ForbiddenError
};
