const errors = require("../../errors");
function renderJSON(response, res) {
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
}

module.exports = {
  renderJSON
};
