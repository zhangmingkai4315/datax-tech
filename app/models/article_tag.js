/*!
 * datax-tech 网站源码
 * Copyright(c) 2017-2018 zhangmingkai4315(zhangmingkai.1989@gmail.com)
 * MIT Licensed
 */

/**
 * 模块导出声明
 * 模块提供article_tags数据库表的模型定义
 * @public
 */

module.exports = (sequelize, DataTypes) => {
  const ArticleTag = sequelize.define(
    "ArticleTag",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      tag_id: { type: DataTypes.INTEGER },
      article_id: { type: DataTypes.INTEGER }
    },
    {
      // 不需要任何时间戳字段（createAt, updatedAt）
      timestamps: false,
      // 不需要提供任何数据库表字符转换（增加复数）
      freezeTableName: true,
      tableName: "article_tags",
      // 不使用驼峰式字符保存变量
      underscored: true
    }
  );
  return ArticleTag;
};
