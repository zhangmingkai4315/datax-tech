const Uploader = require("jquery-file-upload-middleware");
const moment = require("moment");
const paginate = require("express-paginate");
const { markdown } = require("markdown");
const db = require("../../../models");
const errors = require("../../errors");

const createArticleView = (req, res) => {
  const { user } = req;
  if (!user) {
    res.render("common/404", { title: "Error 500" });
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
};

const uploadCoverImg = (req, res, next) => {
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
};

const getArticleById = async (req, res) => {
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
    console.log(comments);
    const contentHTML = markdown.toHTML(article.content);
    res.render("articles/page.ejs", {
      moment,
      user: article.User,
      current_user: req.user,
      editable: req.user && req.user.username === article.User.username,
      contentHTML,
      article,
      comments,
      title: article.name
    });
  } catch (err) {
    console.log(err);
    res.render("common/500.ejs", { title: "Error 500" });
  }
};
const createArticle = (req, res) => {
  db.Article.create({
    title: req.body.title,
    content: req.body.content,
    cover_img: req.body.cover_img,
    cover_img_thumbnail: req.body.cover_img_thumbnail,
    user_id: req.user.id
  })
    .then(article => {
      res.json({ data: article.id });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

// 使用分页方式对于数据进行分页处理
const getArticles = async (req, res, next) => {
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
      articles: articles,
      pageCount,
      itemCount,
      moment,
      author: null,
      pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createArticle,
  createArticleView,
  uploadCoverImg,
  getArticleById,
  getArticles
};
