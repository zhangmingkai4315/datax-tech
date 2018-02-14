/*!
 * datax-tech 网站源码
 * Copyright(c) 2017-2018 zhangmingkai4315(zhangmingkai.1989@gmail.com)
 * MIT Licensed
 */

const db = require("../../../models");

/**
 * getSkills 获取所有技能的API
 *
 * 提供自动匹配相似字段
 * @param {object} req express.req对象
 * @param {object} res express.res对象
 * @returns {}
 */
const getSkills = (req, res) => {
  if (req.query && req.query.q) {
    const queryTerm = `%${req.query.q}%`;
    db.Skill.findAll({
      attributes: ["id", "name"],
      where: {
        name: {
          $like: queryTerm
        }
      }
    })
      .then(skills => {
        const results = Object.assign(
          {},
          {
            data: skills.map(item => ({ id: item.id, text: item.name }))
          }
        );
        res.json(results);
      })
      .catch(err => res.status(500).json({ error: err }));
  } else {
    db.Skill.findAll({
      attributes: ["id", "name"]
    })
      .then(skills => {
        const results = Object.assign(
          {},
          {
            data: skills.map(item => ({ id: item.id, text: item.name }))
          }
        );
        res.json(results);
      })
      .catch(err => res.status(500).json({ error: err }));
  }
};

/**
 * createSkills 创建新的技能API
 *
 * @param {object} req express.req对象
 * @param {object} res express.res对象
 * @returns {}
 */
const createSkills = (req, res) => {
  if (!req.body.name) {
    res.status(400).json({ error: "post data error" });
    return;
  }
  db.Skill.create({ name: req.body.name })
    .then(s => res.json({ data: s }))
    .catch(err => res.status(500).json({ error: err }));
};

/**
 * 模块导出声明
 * @public
 */
module.exports = {
  getSkills,
  createSkills
};
