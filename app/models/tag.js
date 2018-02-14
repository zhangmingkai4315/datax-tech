/*!
 * datax-tech 网站源码
 * Copyright(c) 2017-2018 zhangmingkai4315(zhangmingkai.1989@gmail.com)
 * MIT Licensed
 */

/**
 * 模块导出声明
 * 模块提供tags数据库表的模型定义
 * @public
 */

module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    "Tag",
    { name: { type: DataTypes.STRING, unique: true, allowNull: false } },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
      tableName: "tags",
      classMethods: {
        associate: models => {
          // example on how to add relations Article.hasMany(models.Comments);
          Tag.belongsToMany(models.Article, {
            through: {
              model: models.ArticleTag,
              unique: false
            },
            foreignKey: "tag_id",
            constraints: false
          });
        }
      }
    }
  );
  return Tag;
};
