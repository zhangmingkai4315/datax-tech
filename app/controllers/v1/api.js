const middleware = require("../../authenticate/middleware");
const db = require("../../models");
// const Sequelize = require('sequelize') const Op = Sequelize.Op

module.exports = (app) => {
  app.get("/api/skills", (req, res) => {
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
  });
  app.post("/api/skills", (req, res) => {
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
  });

  app.post("/api/comments", middleware.authenticationMiddle, (req, res) => {
    const {articleId} = req.body;
    const content = req.body.comment;

    if (!articleId || !content) {
      res
        .status(400)
        .json({error: "comment data error"});
      return;
    }
    db
      .Article
      .findById(articleId)
      .then(article => ((article)
        ? (db.Comment.create({user_id: req.user.id, articleId, content}))
        : (res.status(404).json({error: "404 error"}))))
      .then(data => res.json({data}))
      .catch(err => res.status(500).json({error: err}));
  });

  app.get("/api/skills", (req, res) => {
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
  });
  app.post("/api/skills", (req, res) => {
    if (!req.body.name) {
      res
        .status(400)
        .json({error: "post data error"});
      return;
    }
    db
      .Skill
      .create({name: req.body.name})
      .then(skills => res.json({data: skills}))
      .catch(err => res.status(500).json({error: err}));
  });
};
