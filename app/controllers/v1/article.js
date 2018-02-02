const Uploader = require("jquery-file-upload-middleware");
const moment = require("moment");
const {markdown} = require("markdown");
const db = require("../../models");
const middleware = require("../../authenticate/middleware");

module.exports = (app) => {
  // 定义用户上传article封面的逻辑接口
  app.post("/upload/articlecover", middleware.authenticationMiddle, (req, res, next) => {
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
  });
  app.get("/user/:username/articles/:id", (req, res) => {
    const {username, id} = req.params;
    if (!id || !username) {
      res.render("common/500.ejs");
      return;
    }

    db
      .User
      .find({
        where: {
          username
        },
        include: [
          {
            model: db.Skill,
            through: {
              attributes: ["id", "name"]
            }
          }, {
            model: db.Article,
            where: {
              id
            },
            include: [
              {
                model: db.Comment,
                order: [
                  db.Comment, "updated_at", "ASC"
                ],
                include: [
                  {
                    model: db.User
                  }
                ]
              }
            ]
          }
        ]
      })
      .then((user) => {
        const articleList = user.Articles;
        if (articleList.length === 0) {
          res.render("common/404.ejs", {title: "Error 404"});
          return;
        }
        const article = articleList[0];
        const comments = article.Comments;
        const contentHTML = markdown.toHTML(article.content);
        res.render("articles/page.ejs", {
          moment,
          user,
          current_user: req.user,
          editable: req.user && req.user.username === username,
          contentHTML,
          article,
          comments,
          title: article.name
        });
      })
      .catch((err) => {
        res.render("common/500.ejs", {title: "Error 500"});
      });
  });
  app.post("/api/articles", middleware.authenticationMiddle, (req, res) => {
    db
      .Article
      .create({title: req.body.title, content: req.body.content, head_img: req.body.head_img, user_id: req.user.id})
      .then((article) => {
        res.json({data: article.id});
      })
      .catch((err) => {
        res
          .status(500)
          .json({error: err});
      });
  });
};
