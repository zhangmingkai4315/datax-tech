/*!
 * datax-tech 网站源码
 * Copyright(c) 2017-2018 zhangmingkai4315(zhangmingkai.1989@gmail.com)
 * MIT Licensed
 */

/**
 * 模块导出声明
 * 模块提供articles数据库表的模型定义
 * @public
 */

module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define(
    "Article",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      content: DataTypes.TEXT,
      cover_img: DataTypes.STRING,
      read_counter: DataTypes.INTEGER,
      like_counter: DataTypes.INTEGER,
      collected_counter: DataTypes.INTEGER,
      cover_img_thumbnail: DataTypes.STRING
    },
    {
      underscored: true,
      tableName: "articles",
      classMethods: {
        associate: models => {
          Article.hasMany(models.Comment, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
          });

          Article.belongsTo(models.User);
          Article.belongsToMany(models.Tag, {
            through: {
              model: models.ArticleTag,
              unique: false
            },
            as: "Tags",
            foreignKey: "article_id",
            constraints: false
          });
          Article.belongsToMany(models.User, {
            through: {
              model: models.UserLike,
              unique: false
            },
            as: "Likers",
            foreignKey: "article_id",
            constraints: false
          });
          Article.belongsToMany(models.User, {
            through: {
              model: models.UserCollection,
              unique: false
            },
            as: "Collectors",
            foreignKey: "article_id",
            constraints: false
          });
        }
      }
    }
  );
  return Article;
};
