const Uploader = require("jquery-file-upload-middleware");
const moment = require("moment");
var markdown = require("markdown").markdown;
const db = require("../../models");
const utils = require("../utils");
const middleware = require("../../authenticate/middleware");

module.exports = (app, passport) => {
  // app.get('/articles',(req,res)=>{ return res.render('auth/signup', {   title:
  // '注册用户',   message: req.flash('signupMessage') }

  // 定义用户上传article封面的逻辑接口
  app.post(
    "/upload/articlecover",
    middleware.authenticationMiddle,
    (req, res, next) => {
      Uploader.on("begin", function(fileInfo) {
        fileInfo.name = new Date().getTime() + fileInfo.originalName;
      });
      Uploader.fileHandler({
        uploadDir: function() {
          return req.app.get("uploadPath") + req.user.username + "/articles";
        },
        uploadUrl: function() {
          return "/uploads/" + req.user.username + "/articles";
        },
        imageVersions: { thumbnail: { width: 200, height: 130 } }
      })(req, res, next);
    }
  );
  app.get("/user/:username/articles/:id", (req, res, next) => {
    const id = req.params.id;
    const username = req.params.username;
    if (!id || !username) {
      res.render("common/500.ejs");
      return;
    }
    db.User.find({
      where: {
        username: username
      },
      include: [
        {
          model: db.Skill,
          through: {
            attributes: ["id", "name"]
          }
        },
        {
          model: db.Article,
          where: {
            id: id
          }
        }
      ]
    })
      .then(user => {
        console.log(user);
        const article = user.Articles;
        if (article.length === 0) {
          res.render("common/404.ejs", { title: "Error 404" });
          return;
        }
        const contentHTML = markdown.toHTML(article[0].content);
        res.render("articles/page.ejs", {
          moment: moment,
          user: user,
          contentHTML: contentHTML,
          article: article[0],
          title: article[0].name,
          editable: req.user.id === user.id
        });
      })
      .catch(err => {
        console.log(err);
        res.render("common/500.ejs", { title: "Error 500" });
      });
  });
  app.post(
    "/api/articles",
    middleware.authenticationMiddle,
    (req, res, next) => {
      const article = db.Article.create({
        title: req.body.title,
        content: req.body.content,
        head_img: req.body.head_img,
        user_id: req.user.id
      })
        .then(article => {
          console.log(article);
          res.json({ data: article.id });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ error: err });
        });
    }
  );
};
