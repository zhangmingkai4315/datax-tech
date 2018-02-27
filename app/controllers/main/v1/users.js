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
const sequelize = require("sequelize");
const paginate = require("express-paginate");

/**
 * 变量声明
 * @private
 */
const db = require("../../../models");
const errors = require("../../errors");
const utils = require("../../utils");

/**
 * getUserStats 获取当前用户统计信息API
 *
 * 使用缓存来降低访问统计API对于数据库的访问
 * @param {object} req express.req对象
 * @param {object} res express.res对象
 * @returns {}
 */
const getUserStats = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw errors.BadRequestError();
    }
    const result = await db.sequelize.query(
      "select user_id,count(*),sum(like_counter) , sum(collected_counter),sum(read_counter) from articles where user_id=?",
      { replacements: [id], type: db.sequelize.QueryTypes.SELECT }
    );
    throw result;
  } catch (data) {
    utils.renderJSON(data, res);
  }
};

/**
 * getUserProfile 获取当前用户Profile信息API
 *
 * @param {object} req express.req对象
 * @param {object} res express.res对象
 * @returns {}
 */
const getUserProfile = async (req, res) => {
  const { username } = req.params;
  if (!username) {
    res.render("common/500.ejs");
    return;
  }
  const currentPage = req.query.page || 1;
  const skip = (currentPage - 1) * req.query.limit;
  try {
    const user = await db.User.findOne({
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
    });
    if (!user) {
      res.render("common/404.ejs", { title: "Error 404" });
    }
    const [articles, itemCount] = await Promise.all([
      db.Article.findAll({
        where: {
          user_id: user.id
        },
        attributes: ["id", "title", "cover_img_thumbnail", "created_at"],
        order: [["updated_at", "DESC"]],
        limit: req.query.limit,
        offset: skip
      }),
      db.Article.count({ where: { user_id: user.id } })
    ]);

    const pageCount = Math.ceil(itemCount / req.query.limit);
    res.render("user/profile.ejs", {
      user,
      articles,
      author: user.username,
      pageCount,
      currentPage,
      pages: paginate.getArrayPages(req)(3, pageCount, req.query.page),
      itemCount,
      moment,
      current_user: req.user,
      editable: req.user && req.user.username === username,
      title: `profile-${user.username}`
    });
  } catch (err) {
    console.log(err);
    res.render("common/500.ejs", { title: "Error 500" });
  }
};

/**
 * editUserProfile 编辑用户Profile页面视图API
 *
 * @param {object} req express.req对象
 * @param {object} res express.res对象
 * @returns {}
 */
const editUserProfile = (req, res) => {
  const { username } = req.params;
  if (!username) {
    res.render("common/500.ejs");
  }
  if (req.user.username !== username) {
    res.render("common/403.ejs", { title: "Error 403" });
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
      }
    ]
  })
    .then(user => {
      if (user) {
        res.render("user/edit.ejs", {
          user,
          current_user: req.user,
          editable: req.user && req.user.username === username,
          title: `profile-${user.username}`
        });
      } else {
        res.render("common/404.ejs", { title: "Error 404" });
      }
    })
    .catch(() => {
      res.render("common/500.ejs", { title: "Error 500" });
    });
};

/**
 * editUserProfileBasic POST数据并修改用户Profile中基本的信息API
 *
 * POST新的数据
 * @param {object} req express.req对象
 * @param {object} res express.res对象
 * @returns {}
 */

const editUserProfileBasic = (req, res) => {
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
};

/**
 * getUserSkills 获取当前用户的skills的API
 *
 * @param {object} req express.req对象
 * @param {object} res express.res对象
 * @returns {}
 */
const getUserSkills = (req, res) => {
  req.user
    .getSkill()
    .then(s => res.json({ data: s }))
    .catch(err => res.status(500).json({ error: err }));
};

/**
 * createUserLinks POST数据并修改用户Profile中社交网络信息API
 *
 * @param {object} req express.req对象
 * @param {object} res express.res对象
 * @returns {}
 */
const createUserLinks = (req, res) => {
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
};

/**
 * createUserSkill POST数据并修改用户Profile中技能信息API
 *
 * @param {object} req express.req对象
 * @param {object} res express.res对象
 * @returns {}
 */
const createUserSkill = (req, res) => {
  const { skills } = req.body;
  const newSkills = skills.filter(s => isNaN(parseInt(s, 10)));
  const oldSkills = skills.filter(
    s => typeof parseInt(s, 10) === "number" && !isNaN(parseInt(s))
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
    .then(s => req.user.setSkills(s))
    .then(() =>
      db.Skill.findAll({
        where: {
          id: {
            $in: oldSkills
          }
        }
      })
    )
    .then(old => req.user.addSkills(old))
    .then(() => res.json({ data: "success" }))
    .catch(err => res.json({ error: err }));
};

/**
 * uploadUserProfileImg POST数据并修改用户Profile中封面信息API
 *
 * @param {object} req express.req对象
 * @param {object} res express.res对象
 * @returns {}
 */
const uploadUserProfileImg = (req, res, next) => {
  Uploader.on("end", (fileinfo, request) => {
    db.User.update(
      {
        image_url: fileinfo.url || "",
        thunbnail_url: fileinfo.thumbnailUrl || ""
      },
      {
        where: {
          id: request.user.id
        }
      }
    ).catch(err => console.log(err));
  });
  Uploader.fileHandler({
    uploadDir: () => req.app.get("uploadPath") + req.user.username,
    uploadUrl: () => `/uploads/${req.user.username}`
  })(req, res, next);
};

/**
 * changePassword POST数据并修改用户密码的API接口
 *
 * POST新的数据
 * @param {object} req express.req对象
 * @param {object} res express.res对象
 * @returns {}
 */

const changePassword = async (req, res) => {
  try {
    const oldPassword = req.body.old_password;
    const newPassword = req.body.new_password;
    const user = req.user;
    // 验证用户输入

    // 验证用户旧密码是否有效,仅当用户的密码字段存在，不存在一般为oath用户登入
    if (user.password) {
      const result = await user.validPassword(oldPassword).then;
      if (!result) {
        throw errors.ForbiddenError();
      }
    }
    // 变更密码
    const newHashPassword = await user.generateHash(newPassword);
    user.password = newHashPassword;
    const result = await user.save();
    throw result;
  } catch (data) {
    console.log(data);
    return utils.renderJSON(data, res);
  }
};

/**
 * 模块导出声明
 * @public
 */
module.exports = {
  getUserProfile,
  editUserProfile,
  editUserProfileBasic,
  getUserSkills,
  getUserStats,
  createUserLinks,
  createUserSkill,
  uploadUserProfileImg,
  changePassword
};
