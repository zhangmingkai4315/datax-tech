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
function renderErrorView(response, res) {
  if (response instanceof errors.CustomError) {
    const code = response.code;
    res.status(code).render(`common/${code}`, { title: `Error ${code}` });
    return;
  }
  if (response instanceof Error) {
    res.status(500).render(`common/500`, { title: `Error 500` });
    return;
  }
}

module.exports = {
  renderJSON,
  renderErrorView
};
