/*!
 * datax-tech 网站源码
 * Copyright(c) 2017-2018 zhangmingkai4315(zhangmingkai.1989@gmail.com)
 * MIT Licensed
 */

/**
 * 变量声明
 * @private
 */
const db = require("../../../models");

/**
 * createComment 创建新的评论API
 *
 * 需认证后的用户才能创建
 * @param {String} req express.req对象
 * @param {object} res express.res对象
 * @returns {}
 */
const createComment = async (req, res) => {
  try {
    const { articleId, comment, parentId } = req.body;
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

/**
 * deleteComment 删除评论API
 *
 * 需认证后的用户才能删除(管理员及本人可操作)
 * @param {String} req express.req对象
 * @param {object} res express.res对象
 * @returns {}
 */
const deleteComment = (req, res) => {
  const { commentId } = req.body;
  db.Comment.findById(commentId)
    .then(comment => {
      if (!comment) {
        res.status(404).json({
          error: "resouce not found"
        });
        return;
      }
      return comment.destroy();
    })
    .then(data =>
      res.json({
        data
      })
    )
    .catch(err =>
      res.status(500).json({
        error: err
      })
    );
};

/**
 * 模块导出声明
 * @public
 */
module.exports = {
  createComment,
  deleteComment
};
