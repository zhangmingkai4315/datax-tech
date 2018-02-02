const Uploader = require("jquery-file-upload-middleware");
const middleware = require("../../authenticate/middleware");
const db = require("../../models");

module.exports = (app) => {
  app.get("/user/:username", (req, res) => {
    const {username} = req.params;
    if (!username) {
      res.render("common/500.ejs");
      return;
    }
    db
      .User
      .findOne({
        where: {
          username
        },
        include: [
          {
            model: db.Skill,
            through: {
              attributes: ["id", "name"]
            }
          },
          db.Article
        ]
      })
      .then((user) => {
        if (user) {
          res.render("user/profile.ejs", {
            user,
            current_user: req.user,
            editable: req.user && req.user.username === username,
            title: `profile-${user.username}`
          });
        } else {
          res.render("common/404.ejs", {title: "Error 404"});
        }
      })
      .catch(() => {
        res.render("common/500.ejs", {title: "Error 500"});
      });
  });
  app.get("/user/:username/edit", middleware.authenticationMiddle, (req, res) => {
    const {username} = req.params;
    if (!username) {
      res.render("common/500.ejs");
    }
    if (req.user.username !== username) {
      res.render("common/403.ejs", {title: "Error 403"});
      return;
    }
    db
      .User
      .findOne({
        where: {
          username
        },
        include: [
          {
            model: db.Skill,
            through: {
              attributes: ["id", "name"]
            }
          }
        ]
      })
      .then((user) => {
        if (user) {
          res.render("user/edit.ejs", {
            user,
            current_user: req.user,
            editable: req.user && req.user.username === username,
            title: `profile-${user.username}`
          });
        } else {
          res.render("common/404.ejs", {title: "Error 404"});
        }
      })
      .catch(() => {
        res.render("common/500.ejs", {title: "Error 500"});
      });
  });

  app.get("/user/:username/write", middleware.authenticationMiddle, (req, res) => {
    const {username} = req.params;
    if (!username) {
      res.render("common/500.ejs");
    }
    if (req.user.username !== username) {
      res.render("common/403.ejs", {title: "Error 403"});
      return;
    }
    db
      .User
      .findOne({
        where: {
          username
        },
        include: [
          {
            model: db.Skill,
            through: {
              attributes: ["id", "name"]
            }
          }
        ]
      })
      .then((user) => {
        if (user) {
          res.render("user/write.ejs", {
            user,
            current_user: req.user,
            editable: req.user && req.user.username === username,
            title: `write-${user.username}`
          });
        } else {
          res.render("common/404.ejs", {title: "Error 404"});
        }
      })
      .catch(() => {
        res.render("common/500.ejs", {title: "Error 500"});
      });
  });
  app.post("/profile/baisc", middleware.authenticationMiddle, (req, res) => {
    db
      .User
      .update({
        group_name: req.body.groupName || "",
        job_name: req.body.jobName || "",
        introduce: req.body.introduce || ""
      }, {
        where: {
          id: req.user.id
        }
      })
      .then((result) => {
        res.json({data: result});
      })
      .catch((err) => {
        res
          .status(500)
          .json({error: err});
      });
  });
  // 更新基本信息,仅限于当前登入用户
  app.get("/api/user/skill", middleware.authenticationMiddle, (req, res) => {
    req
      .user
      .getSkill()
      .then(s => res.json({data: s}))
      .catch(err => res.status(500).json({error: err}));
  });
  app.post("/api/user/links", middleware.authenticationMiddle, (req, res) => {
    db
      .User
      .update({
        globe_url: req.body.globe_url || "",
        weibo_url: req.body.weibo_url || "",
        facebook_url: req.body.facebook_url || "",
        twitter_url: req.body.twitter_url || "",
        github_url: req.body.github_url || ""
      }, {
        where: {
          id: req.user.id
        }
      })
      .then((result) => {
        res.json({data: result});
      })
      .catch((err) => {
        res
          .status(500)
          .json({error: err});
      });
  });
  app.post("/api/user/skill", middleware.authenticationMiddle, (req, res) => {
    const {skills} = req.body;
    const newSkills = skills.filter(s => isNaN(parseInt(s, 10)));
    const oldSkills = skills.filter(s => typeof parseInt(s, 10) === "number" && !isNaN(parseInt(s)));
    req
      .user
      .setSkills([])
      .then(() => {
        if (skills.length === 0) {
          res.json({data: "remove all skills"});
          return;
        }
        const newSkillObject = newSkills.map(n => ({name: n}));
        return db
          .Skill
          .bulkCreate(newSkillObject, {individualHooks: true});
      })
      .then(s => req.user.setSkills(s))
      .then(() => db.Skill.findAll({
        where: {
          id: {
            $in: oldSkills
          }
        }
      }))
      .then(old => req.user.addSkills(old))
      .then(() => res.json({data: "success"}))
      .catch(err => res.json({error: err}));
  });
  app.use("/upload/userimg", middleware.authenticationMiddle, (req, res, next) => {
    Uploader.on("end", (fileinfo, req, res) => {
      db
        .User
        .update({
          image_url: fileinfo.url || "",
          thunbnail_url: fileinfo.thumbnailUrl || ""
        }, {
          where: {
            id: req.user.id
          }
        })
        .catch(err => console.log(err));
    });
    Uploader.fileHandler({
      uploadDir: () => (req.app.get("uploadPath") + req.user.username),
      uploadUrl: () => `/uploads/${req.user.username}`
    })(req, res, next);
  });
};
