const errors = require("../../errors");
function renderJSON(response, res) {
  if (response instanceof errors.CustomError) {
    res.status(response.Code).json({
      error: response.name,
      message: response.message
    });
  } else {
    res.json({
      data: response
    });
  }
}

module.exports = {
  renderJSON
};
