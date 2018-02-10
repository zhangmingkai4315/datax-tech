const db = require("../../../models");

const createComment = async (req, res) => {
  try {
    const {
      articleId,
      comment,
      parentId
    } = req.body;
    if (!articleId || !comment) {
      res.status(400).json({
        error: "post data error"
      });
      return;
    }
    const article = await db.Article.findById(articleId);
    if (article) {
      const creatResult = await db.Comment.create({
        user_id: req.user.id,
        article_id: articleId,
        content: comment,
        parent_id: parentId
      });
      res.json({
        data: creatResult
      });
    } else {
      res.status(404).json({
        error: "404 error"
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};

const deleteComment = (req, res) => {
  const {
    commentId
  } = req.body;
  db.Comment.findById(commentId)
    .then((comment) => {
      if (!comment) {
        res.status(404).json({
          error: "resouce not found"
        });
        return;
      }
      return comment.destroy();
    })
    .then(data => res.json({
      data
    }))
    .catch(err => res.status(500).json({
      error: err
    }));
};

module.exports = {
  createComment,
  deleteComment
};
