const db = require("../../../models");

const createComment = (req, res) => {
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
};

const deleteComment = (req, res) => {
  const {commentId} = req.body;
  db
    .Comment
    .findById(commentId)
    .then((comment) => {
      if (!comment) {
        res
          .status(404)
          .json({error: "resouce not found"});
      } else {
        return comment.destroy();
      }
    })
    .then(data => res.json({data}))
    .catch(err => res.status(500).json({error: err}));
};

module.exports = {
  createComment,
  deleteComment
};
