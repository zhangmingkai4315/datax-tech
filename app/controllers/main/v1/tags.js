/*!
 * datax-tech 网站源码
 * Copyright(c) 2017-2018 zhangmingkai4315(zhangmingkai.1989@gmail.com)
 * MIT Licensed
 */

/**
 * 变量声明
 * @private
 */
const db = require("../../../models");

/**
 * getTags 获取所有标签API
 *
 * 提供匹配相似字符
 * @param {object} req express.req对象
 * @param {object} res express.res对象
 * @returns {}
 */
const getTags = (req, res) => {
  if (req.query && req.query.q) {
    const queryTerm = `%${req.query.q}%`;
    db.Tag.findAll({
      attributes: ["id", "name"],
      where: {
        name: {
          $like: queryTerm
        }
      }
    })
      .then(tags => {
        const results = Object.assign(
          {},
          {
            data: tags.map(item => ({ id: item.id, text: item.name }))
          }
        );
        res.json(results);
      })
      .catch(err => res.status(500).json({ error: err }));
  } else {
    db.Tag.findAll({
      attributes: ["id", "name"]
    })
      .then(tags => {
        const results = Object.assign(
          {},
          {
            data: tags.map(item => ({ id: item.id, text: item.name }))
          }
        );
        res.json(results);
      })
      .catch(err => res.status(500).json({ error: err }));
  }
};

/**
 * createTag 创建新的标签API
 *
 * @param {object} req express.req对象
 * @param {object} res express.res对象
 * @returns {}
 */
const createTag = (req, res) => {
  if (!req.body.name) {
    res.status(400).json({ error: "post data error" });
    return;
  }
  db.Tag.create({ name: req.body.name })
    .then(s => res.json({ data: s }))
    .catch(err => res.status(500).json({ error: err }));
};

/**
 * 模块导出声明
 * @public
 */
module.exports = {
  getTags,
  createTag
};
