const db = require("../../../models");

const getTags = (req, res) => {
  if (req.query && req.query.q) {
    const queryTerm = `%${req.query.q}%`;
    db.Tag.findAll({
      attributes: ["id", "name"],
      where: {
        name: {
          $like: queryTerm
        }
      }
    })
      .then(tags => {
        const results = Object.assign(
          {},
          {
            data: tags.map(item => ({ id: item.id, text: item.name }))
          }
        );
        res.json(results);
      })
      .catch(err => res.status(500).json({ error: err }));
  } else {
    db.Tag.findAll({
      attributes: ["id", "name"]
    })
      .then(tags => {
        const results = Object.assign(
          {},
          {
            data: tags.map(item => ({ id: item.id, text: item.name }))
          }
        );
        res.json(results);
      })
      .catch(err => res.status(500).json({ error: err }));
  }
};
const createTag = (req, res) => {
  if (!req.body.name) {
    res.status(400).json({ error: "post data error" });
    return;
  }
  db.Tag.create({ name: req.body.name })
    .then(s => res.json({ data: s }))
    .catch(err => res.status(500).json({ error: err }));
};

module.exports = {
  getTags,
  createTag
};
