/*!
 * datax-tech 网站源码
 * Copyright(c) 2017-2018 zhangmingkai4315(zhangmingkai.1989@gmail.com)
 * MIT Licensed
 */

/**
 * 模块依赖
 * @private
 */
const Uploader = require("jquery-file-upload-middleware");
const moment = require("moment");
const paginate = require("express-paginate");
const { markdown } = require("markdown");

/**
 * 变量声明
 * @private
 */
const db = require("../../../models");
const utils = require("../../utils");
const errors = require("../../errors");

/**
 * getArticlesStats 获取本站所有文章统计信息API
 *
 * 设置中间件缓存，用于减轻服务器压力
 * @param {object} req express.req对象
 * @param {object} res express.res对象
 * @returns {}
 */
async function getArticlesStats(req, res) {
  try {
    // 通过直接使用sql来查询统计信息
    const result = await db.sequelize.query(
      "select count(*),sum(like_counter),sum(collected_counter),sum(read_counter) from articles",
      { type: db.sequelize.QueryTypes.SELECT }
    );
    throw result;
  } catch (data) {
    utils.renderJSON(data, res);
  }
}

/**
 * deleteArticleById 获取指定ID的文章内容API
 *
 * @param {object} req express.req对象
 * @param {object} res express.res对象
 * @returns {}
 */
async function deleteArticleById(req, res) {
  try {
    const { id } = req.params;
    const affectedRows = await db.Article.destroy({
      where: {
        id,
        user_id: req.user.id
      }
    });
    if (affectedRows <= 0) {
      throw errors.NotFoundError();
    } else {
      throw req.user.username;
    }
  } catch (err) {
    utils.renderJSON(err, res);
  }
}

/**
 * editAticleView 获取编辑文章内容视图的API
 *
 * @param {object} req express.req对象
 * @param {object} res express.res对象
 * @returns {}
 */
async function editAticleView(req, res) {
  try {
    const { id } = req.params;
    const user = req.user;
    if (!id) {
      throw errors.BadRequestError();
    }
    const article = await db.Article.findById(id);
    article.Tags = await article.getTags();
    // 用户访问不属于自己的资源时
    if (article.user_id !== user.id) {
      throw errors.ForbiddenError();
    }
    res.render("articles/edit_page.ejs", {
      current_user: user,
      user,
      article,
      editable: true
    });
  } catch (err) {
    console.log(err);
    utils.renderErrorView(err, res);
  }
}

/**
 * editAticlePost 当用户post编辑后的文章内容视图的API
 *
 * @param {String} req express.req对象
 * @param {object} res express.res对象
 * @returns {}
 */
async function editAticlePost(req, res) {
  try {
    const { id } = req.params;
    const { content, cover_img, cover_img_thumbnail, tags, title } = req.body;
    const user = req.user;
    if (!id) {
      throw errors.BadRequestError();
    }
    const article = await db.Article.findById(id);
    // 用户访问不属于自己的资源时
    if (article.user_id !== user.id) {
      throw errors.ForbiddenError();
    }
    // 验证用户输入信息

    // update article
    await article.update({
      title,
      content,
      cover_img,
      cover_img_thumbnail
    });

    // 更新tag信息
    const newTags = tags.filter(s => isNaN(parseInt(s, 10)));
    const oldTags = tags.filter(
      s => typeof parseInt(s, 10) === "number" && !isNaN(parseInt(s))
    );

    // 创建新的tags
    const newTagsObject = newTags.map(n => ({ name: n }));
    const newTagsInDb = await db.Tag.bulkCreate(newTagsObject, {
      individualHooks: true
    });

    const oldTagsInDb = await db.Tag.findAll({
      where: { id: { $in: oldTags } }
    });
    // 保存所有的数据
    const saveNewTags = await article.setTags([...newTagsInDb, ...oldTagsInDb]);
    throw article.id;
  } catch (err) {
    console.log(err);
    utils.renderJSON(err, res);
  }
}

/**
 * createArticleView 创建新的文章页面视图的API
 *
 * @param {object} req express.req对象
 * @param {object} res express.res对象
 * @returns {}
 */

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

/**
 * uploadCoverImg 上传封面图片API
 *
 * @param {object} req express.req对象
 * @param {object} res express.res对象
 * @returns {}
 */
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

/**
 * getArticleById 获取文章内容视图API
 *
 * @param {object} req express.req对象
 * @param {object} res express.res对象
 * @returns {}
 */
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
    const tags = await article.getTags();
    console.log(tags);
    const contentHTML = markdown.toHTML(article.content);
    res.render("articles/page.ejs", {
      moment,
      user: article.User,
      current_user: req.user,
      editable: req.user && req.user.username === article.User.username,
      contentHTML,
      article,
      comments,
      tags,
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

/**
 * createArticle 当用户POST创建新的文章的API
 *
 * @param {object} req express.req对象
 * @param {object} res express.res对象
 * @returns {}
 */
const createArticle = async (req, res) => {
  try {
    //创建文章内容
    const { title, content, cover_img, cover_img_thumbnail, tags } = req.body;
    if (!title || !content) {
      throw errors.BadRequestError();
    }
    const article = await db.Article.create({
      title: title,
      content: content,
      cover_img: cover_img,
      cover_img_thumbnail: cover_img_thumbnail,
      user_id: req.user.id
    });

    // 分离出哪些是tags字符内容 哪些是数字
    const newTags = tags.filter(s => isNaN(parseInt(s, 10)));
    const oldTags = tags.filter(
      s => typeof parseInt(s, 10) === "number" && !isNaN(parseInt(s))
    );

    // 创建新的tags
    const newTagsObject = newTags.map(n => ({ name: n }));
    const newTagsInDb = await db.Tag.bulkCreate(newTagsObject, {
      individualHooks: true
    });

    const oldTagsInDb = await db.Tag.findAll({
      where: { id: { $in: oldTags } }
    });
    // 保存所有的数据
    const saveNewTags = await article.setTags([...newTagsInDb, ...oldTagsInDb]);
    res.json({ data: article.id, result: saveNewTags });
  } catch (err) {
    utils.renderJSON(err, res);
  }
};

/**
 * getArticles 获取文章列表视图API
 *
 * @param {object} req express.req对象
 * @param {object} res express.res对象
 * @returns {}
 */
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

/**
 * collectionArticle 点击收藏/取消收藏文章的API
 *
 * @param {object} req express.req对象
 * @param {object} res express.res对象
 * @returns {}
 */
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

/**
 * likeArticle 点击喜欢/取消喜欢文章的API
 *
 * @param {object} req express.req对象
 * @param {object} res express.res对象
 * @returns {}
 */
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

/**
 * 模块导出声明
 * @public
 */
module.exports = {
  createArticle,
  editAticleView,
  editAticlePost,
  deleteArticleById,
  createArticleView,
  uploadCoverImg,
  getArticleById,
  getArticles,
  getArticlesStats,
  likeArticle,
  collectionArticle
};
