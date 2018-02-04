const Uploader = require("jquery-file-upload-middleware");
const moment = require("moment");
const {markdown} = require("markdown");
const db = require("../../../models");
const errors = require("../../errors");

const createArticleView = (req, res) => {
  const {user} = req;
  if (!user) {
    res.render("common/404", {title: "Error 500"});
  }
  user
    .getSkills()
    .then((skills) => {
      user.Skills = skills;
      res.render("user/write.ejs", {
        current_user: user,
        user,
        editable: true,
        title: `create-article-${user.username}`
      });
    })
    .catch(() => {
      res.render("common/500.ejs")
    })

};

const uploadCoverImg = (req, res, next) => {
  Uploader.on("begin", (fileInfo) => {
    fileInfo.name = new Date().getTime() + fileInfo.originalName;
  });
  Uploader.fileHandler({
    uploadDir: () => `${req
      .app
      .get("uploadPath")}${req
      .user
      .username}/articles`,
    uploadUrl: () => `/uploads/${req.user.username}/articles`,
    imageVersions: {
      thumbnail: {
        width: 200,
        height: 130
      }
    }
  })(req, res, next);
};

const getArticle = (req, res) => {
  const {id} = req.params;
  if (!id) {
    res.render("common/500.ejs");
    return;
  }

  db
    .Article
    .findById(id, {
      include: [
        {
          model: db.User,
          include: [
            {
              model: db.Skill
            }
          ]
        }
      ]
    })
    .then((article) => {
      // console.log(article)
      if (!article) {
        throw errors.NotFoundError();
      }
      const commentPromise = article.getComments({
        where: {
          article_id: article.id
        },
        order: "updated_at asc",
        include: [
          {
            model: db.User
          }
        ]
      });
      return Promise.all([commentPromise, article]);
    })
    .then(([comments, article]) => {
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
    })
    .catch((err) => {
      console.log(err);
      res.render("common/500.ejs", {title: "Error 500"});
    });
};
const createArticle = (req, res) => {
  db
    .Article
    .create({title: req.body.title, content: req.body.content, cover_img: req.body.cover_img, cover_img_thumbnail: req.body.cover_img_thumbnail, user_id: req.user.id})
    .then((article) => {
      res.json({data: article.id});
    })
    .catch((err) => {
      res
        .status(500)
        .json({error: err});
    });
};

module.exports = {
  createArticle,
  createArticleView,
  uploadCoverImg,
  getArticle
};
