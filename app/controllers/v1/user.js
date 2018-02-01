const Uploader = require("jquery-file-upload-middleware");
const middleware = require("../../authenticate/middleware");
const db = require("../../models");
const utils = require("../utils");
module.exports = (app, passport) => {
  app.get("/user/:username", middleware.authenticationMiddle, (req, res) => {
    const username = req.params.username;
    if (!username) {
      res.render("common/500.ejs");
      return;
    }
    db.User.findOne({
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
      .then(user => {
        if (user) {
          res.render("user/profile.ejs", {
            user: user,
            title: `用户:${user.username}`,
            editable: req.user.username === username
          });
        } else {
          res.render("common/404.ejs", { title: "Error 404" });
        }
      })
      .catch(() => {
        res.render("common/500.ejs", { title: "Error 500" });
      });
  });
  app.get(
    "/user/:username/edit",
    middleware.authenticationMiddle,
    (req, res) => {
      const username = req.params.username;
      if (!username) {
        res.render("common/500.ejs");
      }
      db.User.findOne({
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
        .then(user => {
          if (user) {
            res.render("user/edit.ejs", {
              user: user,
              title: "Profile",
              editable: req.user.username === username
            });
          } else {
            res.render("common/404.ejs", { title: "Error 404" });
          }
        })
        .catch(() => {
          res.render("common/500.ejs", { title: "Error 500" });
        });
    }
  );

  app.get(
    "/user/:username/write",
    middleware.authenticationMiddle,
    (req, res) => {
      const username = req.params.username;
      if (!username) {
        res.render("common/500.ejs");
      }
      db.User.findOne({
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
        .then(user => {
          if (user) {
            res.render("user/write.ejs", {
              user: user,
              title: "WritePage",
              editable: req.user.username === username
            });
          } else {
            res.render("common/404.ejs", { title: "Error 404" });
          }
        })
        .catch(() => {
          res.render("common/500.ejs", { title: "Error 500" });
        });
    }
  );
  app.post("/profile/baisc", middleware.authenticationMiddle, (req, res) => {
    db.User.update(
      {
        group_name: req.body.groupName || "",
        job_name: req.body.jobName || "",
        introduce: req.body.introduce || ""
      },
      {
        where: {
          id: req.user.id
        }
      }
    )
      .then(result => {
        res.json({ data: result });
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  });

  app.get("/api/user/skill", middleware.authenticationMiddle, (req, res) => {
    req.user
      .getSkill()
      .then(skill => {
        return res.json({ data: skill });
      })
      .catch(err => {
        return res.status(500).json({ error: err });
      });
  });
  app.post("/api/user/links", middleware.authenticationMiddle, (req, res) => {
    db.User.update(
      {
        globe_url: req.body.globe_url || "",
        weibo_url: req.body.weibo_url || "",
        facebook_url: req.body.facebook_url || "",
        twitter_url: req.body.twitter_url || "",
        github_url: req.body.github_url || ""
      },
      {
        where: {
          id: req.user.id
        }
      }
    )
      .then(result => {
        res.json({ data: result });
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  });
  app.post("/api/user/skill", middleware.authenticationMiddle, (req, res) => {
    const skills = req.body.skills;
    const newSkills = skills.filter(s => isNaN(parseInt(s)));
    const oldSkills = skills.filter(
      s => typeof parseInt(s) === "number" && !isNaN(parseInt(s))
    );
    req.user
      .setSkills([])
      .then(() => {
        if (skills.length === 0) {
          res.json({ data: "remove all skills" });
          return;
        }
        const newSkillObject = newSkills.map(n => ({ name: n }));
        return db.Skill.bulkCreate(newSkillObject, { individualHooks: true });
      })
      .then(skills => {
        return req.user.setSkills(skills);
      })
      .then(() => {
        return db.Skill.findAll({
          where: {
            id: {
              $in: oldSkills
            }
          }
        });
      })
      .then(oldSkills => {
        return req.user.addSkills(oldSkills);
      })
      .then(() => {
        return res.json({ data: "success" });
      })
      .catch(err => {
        console.log(err);
        return res.json({ error: "error" });
      });
  });
  app.use("/upload/userimg", middleware.authenticationMiddle, function(
    req,
    res,
    next
  ) {
    Uploader.on("end", function(fileinfo, req, res) {
      db.User.update(
        {
          image_url: fileinfo.url || "",
          thunbnail_url: fileinfo.thumbnailUrl || ""
        },
        {
          where: {
            id: req.user.id
          }
        }
      )
        .then(() => {
          console.log("update user img success");
        })
        .catch(err => console.log(err));
    });
    Uploader.fileHandler({
      uploadDir: function() {
        return req.app.get("uploadPath") + req.user.username;
      },
      uploadUrl: function() {
        return "/uploads/" + req.user.username;
      }
    })(req, res, next);
  });
};
