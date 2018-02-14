/*!
 * datax-tech 网站源码
 * Copyright(c) 2017-2018 zhangmingkai4315(zhangmingkai.1989@gmail.com)
 * MIT Licensed
 */

/**
 * 模块导出声明
 * 模块提供comments数据库表的模型定义
 * @public
 */

module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define(
    "Comment",
    {
      article_id: { type: Sequelize.INTEGER, allowNull: false },
      content: { type: Sequelize.TEXT, allowNull: false },
      user_id: { type: Sequelize.INTEGER, allowNull: false },
      parent_id: { type: Sequelize.INTEGER },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    },
    {
      underscored: true,
      tableName: "comments",
      classMethods: {
        associate: models => {
          Comment.belongsTo(models.Article, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
          });
          Comment.hasMany(models.Comment, {
            as: "SubComments",
            foreignKey: "parent_id"
          });
          Comment.belongsTo(models.Comment, {
            as: "Parent"
          });
          Comment.belongsTo(models.User, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
          });
        }
      }
    }
  );
  return Comment;
};
