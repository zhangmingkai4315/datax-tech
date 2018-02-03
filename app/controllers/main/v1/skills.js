const db = require("../../../models");

const getSkills = (req, res) => {
  if (req.query && req.query.q) {
    const queryTerm = `%${req.query.q}%`;
    db
      .Skill
      .findAll({
        attributes: [
          "id", "name"
        ],
        where: {
          name: {
            $like: queryTerm
          }
        }
      })
      .then((skills) => {
        const results = Object.assign({}, {
          data: skills.map(item => ({id: item.id, text: item.name}))
        });
        res.json(results);
      })
      .catch(err => res.status(500).json({error: err}));
  } else {
    db
      .Skill
      .findAll({
        attributes: ["id", "name"]
      })
      .then((skills) => {
        const results = Object.assign({}, {
          data: skills.map(item => ({id: item.id, text: item.name}))
        });
        res.json(results);
      })
      .catch(err => res.status(500).json({error: err}));
  }
};
const createSkills = (req, res) => {
  if (!req.body.name) {
    res
      .status(400)
      .json({error: "post data error"});
    return;
  }
  db
    .Skill
    .create({name: req.body.name})
    .then(s => res.json({data: s}))
    .catch(err => res.status(500).json({error: err}));
};

module.exports = {
  getSkills,
  createSkills
};
