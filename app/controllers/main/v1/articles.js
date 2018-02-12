const Uploader = require("jquery-file-upload-middleware");
const moment = require("moment");
const paginate = require("express-paginate");
const { markdown } = require("markdown");
const db = require("../../../models");
const utils = require("./utils");

async function getArticlesStats(req, res) {
  try {
    const result = await db.sequelize.query(
      "select count(*),sum(like_counter),sum(collected_counter),sum(read_counter) from articles",
      { type: db.sequelize.QueryTypes.SELECT }
    );
    throw result;
  } catch (data) {
    utils.renderJSON(data, res);
  }
}

function createArticleView(req, res) {
  const { user } = req;
  if (!user) {
    res.render("common/404", {
      title: "Error 500"
    });
  }
  user
    .getSkills()
    .then(skills => {
      user.Skills = skills;
      res.render("user/write.ejs", {
        current_user: user,
        user,
        editable: true,
        title: `create-article-${user.username}`
      });
    })
    .catch(() => {
      res.render("common/500.ejs");
    });
}

async function uploadCoverImg(req, res, next) {
  Uploader.on("begin", fileInfo => {
    fileInfo.name = new Date().getTime() + fileInfo.originalName;
  });
  Uploader.fileHandler({
    uploadDir: () =>
      `${req.app.get("uploadPath")}${req.user.username}/articles`,
    uploadUrl: () => `/uploads/${req.user.username}/articles`,
    imageVersions: {
      thumbnail: {
        width: 200,
        height: 130
      }
    }
  })(req, res, next);
}
async function getArticleById(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      res.render("common/404.ejs");
      return;
    }
    const article = await db.Article.findById(id, {
      include: [
        {
          model: db.User,
          attributes: [
            "id",
            "username",
            "group_name",
            "job_name",
            "thunbnail_url"
          ]
        }
      ]
    });
    if (!article) {
      res.render("common/404.ejs");
      return;
    }
    const comments = await db.Comment.findAll({
      where: {
        article_id: article.id,
        parent_id: null
      },
      order: "updated_at desc",
      limit: 20,
      include: [
        {
          model: db.User,
          attributes: ["id", "username", "thunbnail_url"]
        },
        {
          model: db.Comment,
          as: "SubComments",
          order: "id desc",
          limit: 10,
          include: [
            {
              model: db.User,
              attributes: ["id", "username"]
            }
          ]
        }
      ]
    });
    let liked = false,
      collected = false;
    if (req.user) {
      result = await Promise.all([
        db.UserLike.find({
          where: {
            user_id: req.user.id,
            article_id: id
          }
        }),
        db.UserCollection.find({
          where: {
            user_id: req.user.id,
            article_id: id
          }
        })
      ]);
      liked = result[0];
      collected = result[1];
    }
    console.log(liked, collected);
    const contentHTML = markdown.toHTML(article.content);
    res.render("articles/page.ejs", {
      moment,
      user: article.User,
      current_user: req.user,
      editable: req.user && req.user.username === article.User.username,
      contentHTML,
      article,
      comments,
      liked,
      collected,
      title: article.name
    });
    await article.update({
      read_counter: (article.read_counter || 0) + 1
    });
  } catch (err) {
    console.log(err);
    res.render("common/500.ejs", {
      title: "Error 500"
    });
  }
}
const createArticle = (req, res) => {
  db.Article.create({
    title: req.body.title,
    content: req.body.content,
    cover_img: req.body.cover_img,
    cover_img_thumbnail: req.body.cover_img_thumbnail,
    user_id: req.user.id
  })
    .then(article => {
      res.json({
        data: article.id
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

// 使用分页方式对于数据进行分页处理
async function getArticles(req, res, next) {
  try {
    const skip = ((req.query.page || 1) - 1) * req.query.limit;
    const [articles, itemCount] = await Promise.all([
      db.Article.findAll({
        attributes: ["id", "title", "cover_img_thumbnail", "created_at"],
        order: [["updated_at", "DESC"]],
        limit: req.query.limit,
        offset: skip,
        include: [
          {
            model: db.User,
            attributes: ["id", "username"]
          }
        ]
      }),
      db.Article.count()
    ]);
    const pageCount = Math.ceil(itemCount / req.query.limit);
    res.render("articles/pages", {
      articles,
      pageCount,
      itemCount,
      moment,
      author: null,
      pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
    });
  } catch (err) {
    next(err);
  }
}

async function collectionArticle(req, res) {
  try {
    const { articleId, collected } = req.body;
    if (!articleId || typeof collected !== "boolean") {
      res.status(400).json({
        error: "post data error"
      });
      return;
    }

    // 找到用户收藏表进行更新操作
    const collectionStatus = await db.UserCollection.find({
      where: {
        user_id: req.user.id,
        article_id: articleId
      }
    });
    if (collectionStatus && collected) {
      res.status(403).json({
        error: "you already collected it"
      });
      return;
    } else if (!collectionStatus && collected === false) {
      res.status(403).json({
        error: "you not collected it before"
      });
      return;
    } else if (collectionStatus && collected === false) {
      await collectionStatus.destroy();
    } else {
      await db.UserCollection.create({
        user_id: req.user.id,
        article_id: articleId
      });
    }

    const article = await db.Article.findById(articleId);
    let newCounter = 0;
    if (collected) {
      newCounter = (article.collected_counter || 0) + 1;
    } else if (article.collected_counter > 1) {
      newCounter = article.collected_counter - 1;
    }
    const result = await article.update({
      collected_counter: newCounter
    });
    res.status(200).json({ data: newCounter });
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
}

async function likeArticle(req, res) {
  try {
    const { articleId, like } = req.body;
    if (!articleId || typeof like !== "boolean") {
      res.status(400).json({
        error: "post data error"
      });
      return;
    }

    // 找到用户喜欢表进行更新操作
    const likeStatus = await db.UserLike.find({
      where: {
        user_id: req.user.id,
        article_id: articleId
      }
    });
    if (likeStatus && like) {
      res.status(403).json({
        error: "you already like it"
      });
      return;
    } else if (!likeStatus && like === false) {
      res.status(403).json({
        error: "you not like it before"
      });
      return;
    } else if (likeStatus && like === false) {
      await likeStatus.destroy();
    } else {
      await db.UserLike.create({
        user_id: req.user.id,
        article_id: articleId
      });
    }

    // 更新文章的喜欢次数
    const article = await db.Article.findById(articleId);
    let newCounter = 0;
    if (like) {
      newCounter = (article.like_counter || 0) + 1;
    } else if (article.like_counter > 1) {
      newCounter = article.like_counter - 1;
    }
    const result = await article.update({
      like_counter: newCounter
    });
    res.status(200).json({ data: newCounter });
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
}

module.exports = {
  createArticle,
  createArticleView,
  uploadCoverImg,
  getArticleById,
  getArticles,
  getArticlesStats,
  likeArticle,
  collectionArticle
};
